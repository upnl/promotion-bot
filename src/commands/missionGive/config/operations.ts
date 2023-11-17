import builders from "./builders.js"
import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User } from "discord.js"
import { getRegular } from "../../../db/actions/memberActions.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { firebaseDb } from "../../../db/firebase.js"
import { ASSOCIATE, MISSION_PROGRESS, QUARTER, REGULAR } from "../../../db/collectionNames.js"
import { regularConverter } from "../../../db/converters/regularConverter.js"
import { missionProgressConverter } from "../../../db/converters/missionConverter.js"
import { ConfigData, ConfigUpdateData } from "../../../interfaces/models/Config.js"
import { createConfigEditPreviewString } from "../../utils/createString/createConfigEditPreviewString.js"
import { getQuarterDataFooter, getQuarterDataString } from "../../utils/quarterData/getQuarterData.js"
import assert from "assert"

const {
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,

    confirmButtonId,
    cancelButtonId,
    actionRow
} = builders

const readOptions = (interaction: ChatInputCommandInteraction) => ({
    goalScore: interaction.options.getNumber("목표점수", true)
})

const doConfirm = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    configUpdateData: ConfigUpdateData,
    configNew: ConfigData, configLast: ConfigData
) => {    
    const success = await firebaseDb.runTransaction(async transaction => {
        const regularDocRef = firebaseDb
            .collection(QUARTER).doc(await getQuarterDataString())
            .collection(REGULAR).doc(interaction.user.id)
            .withConverter(regularConverter)
        const associateProgressDocRefs = await firebaseDb
            .collection(QUARTER).doc(await getQuarterDataString())
            .collection(ASSOCIATE)
            .get().then(qsnapshot => qsnapshot.docs.map(snapshot =>
                snapshot.ref.collection(MISSION_PROGRESS).doc(interaction.user.id).withConverter(missionProgressConverter)
            ))


        transaction.update(regularDocRef, { config: configNew })
        if (configUpdateData.goalScore !== undefined)
            for (const associateProgressDocRef of associateProgressDocRefs)
                transaction.update(associateProgressDocRef, { goalScore: configNew.goalScore })

        return true
    })

    if (success) {
        const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
            .setDescription(createConfigEditPreviewString(configNew, configLast))

        await buttonInteraction.deferUpdate()
        await interaction.editReply({ embeds: [successEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }
    else
        await buttonInteraction.reply({ embeds: [errorEmbed] })
}

const doCancel = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    configUpdateData: ConfigUpdateData,
    configNew: ConfigData, configLast: ConfigData
) => {
    const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
        .setDescription(createConfigEditPreviewString(configNew, configLast))

    await buttonInteraction.deferUpdate()
    await interaction.editReply({ embeds: [cancelEmbed.setFooter(await getQuarterDataFooter())], components: [] })
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    configUpdateData: ConfigUpdateData,
    configNew: ConfigData, configLast: ConfigData
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })

    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, configUpdateData, configNew, configLast)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, configUpdateData, configNew, configLast)
    })
}

const doReply = async (interaction: ChatInputCommandInteraction, configUpdateData: ConfigUpdateData, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply()

    const regular = await getRegular(interaction.user.id)
    assert(regular !== undefined)

    const configLast = regular.config
    const configNew: ConfigData = {
        ...regular.config,
        ...configUpdateData
    }

    const replyEmbed = new EmbedBuilder(replyEmbedPrototype.toJSON())
        .setDescription(createConfigEditPreviewString(configNew, configLast))

    const reply = await interaction.editReply({ embeds: [replyEmbed.setFooter(await getQuarterDataFooter())], components: [actionRow] })

    if (!isEditing)
        addCollector(interaction, reply, configUpdateData, configNew, configLast)
}

export default {
    readOptions,
    doReply
}
import assert from "assert"
import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"
import { getRegular } from "../../../db/actions/memberActions.js"
import { ASSOCIATE, MISSION_PROGRESS, QUARTER, REGULAR } from "../../../db/collectionNames.js"
import { missionProgressConverter } from "../../../db/converters/missionConverter.js"
import { regularConverter } from "../../../db/converters/regularConverter.js"
import { firebaseDb } from "../../../db/firebase.js"
import { ConfigData, ConfigUpdateData } from "../../../interfaces/models/Config.js"
import { addConfirmCollector, createConfirmActionRow } from "../../utils/components/confirmActionRow.js"
import { createConfigEditPreviewString } from "../../utils/createString/createConfigEditPreviewString.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { getQuarterDataFooter, getQuarterDataString } from "../../utils/quarterData/getQuarterData.js"
import builders from "./builders.js"

const {
    commandId,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,
} = builders

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    goalScore: interaction.options.getNumber("목표점수", true)
})

const onConfirm = (interaction: ChatInputCommandInteraction, configUpdateData: ConfigUpdateData, configNew: ConfigData, configLast: ConfigData) =>
    async (buttonInteraction: ButtonInteraction) => {
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

const onCancel = (interaction: ChatInputCommandInteraction, configNew: ConfigData, configLast: ConfigData) =>
    async (buttonInteraction: ButtonInteraction) => {
        const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
            .setDescription(createConfigEditPreviewString(configNew, configLast))

        await buttonInteraction.deferUpdate()
        await interaction.editReply({ embeds: [cancelEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }

export const doReply = async (interaction: ChatInputCommandInteraction, configUpdateData: ConfigUpdateData, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply({ ephemeral: true })

    const regular = await getRegular(interaction.user.id)
    assert(regular !== undefined)

    const configLast = regular.config
    const configNew: ConfigData = {
        ...regular.config,
        ...configUpdateData
    }


    const reply = await interaction.editReply({
        embeds: [EmbedBuilder.from(replyEmbedPrototype)
            .setDescription(createConfigEditPreviewString(configNew, configLast))
            .setFooter(await getQuarterDataFooter())],
        components: [createConfirmActionRow(commandId, interaction.user)]
    })

    if (!isEditing)
        addConfirmCollector(
            commandId, interaction, reply,
            onConfirm(interaction, configUpdateData, configNew, configLast),
            onCancel(interaction, configNew, configLast)
        )
}
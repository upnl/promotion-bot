import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, InteractionResponse, Message } from "discord.js"
import { firebaseDb } from "../../db/firebase.js"
import { ASSOCIATE, MISSION_PROGRESS, QUARTER, REGULAR } from "../../db/collectionNames.js"
import { regularConverter } from "../../db/converters/regularConverter.js"
import { associateConverter } from "../../db/converters/associateConverter.js"
import { missionProgressConverter } from "../../db/converters/missionConverter.js"
import builders from "./builders.js"
import { errorEmbed, notAssociateEmbed } from "../utils/errorEmbeds.js"
import { getQuarterDataFooter, getQuarterDataString } from "../utils/quarterData/getQuarterData.js"
import assert from "assert"
import { getRoleIds } from "../utils/roleId/getRoleIds.js"

const {
    applyEmbed,
    successEmbed,
    canceledEmbed,
    duplicateEmbed,
    confirmButtonId,
    cancelButtonId,
    actionRow
} = builders

const doConfirm = async (interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction) => {
    await buttonInteraction.deferReply({ ephemeral: true })

    try {
        const associateDocRef = firebaseDb
            .collection(QUARTER).doc(await getQuarterDataString())
            .collection(ASSOCIATE).doc(interaction.user.id)
        const regularCollectionRef = firebaseDb
            .collection(QUARTER).doc(await getQuarterDataString())
            .collection(REGULAR)

        const success = await firebaseDb.runTransaction(async transaction => {
            if (await transaction.get(associateDocRef).then(snapshot => snapshot.exists))
                return false

            const regularSnapshots = await transaction.get(regularCollectionRef.withConverter(regularConverter))

            await transaction.set(associateDocRef.withConverter(associateConverter), {})
            for (const regularSnapshot of regularSnapshots.docs) {
                await transaction.set(
                    associateDocRef.collection(MISSION_PROGRESS).doc(regularSnapshot.id).withConverter(missionProgressConverter),
                    {
                        currentScore: 0,
                        goalScore: regularSnapshot.data().config.goalScore
                    }
                )
            }

            return true;
        })

        if (success) {
            await buttonInteraction.deleteReply()
            await interaction.editReply({ embeds: [successEmbed.setFooter(await getQuarterDataFooter())], components: [] })
        }
        else {
            await buttonInteraction.deferReply({ephemeral: true})
            await interaction.editReply({ embeds: [duplicateEmbed.setFooter(await getQuarterDataFooter())], components: [] })
        }
    }
    catch (e) {
        console.error(e)
        await buttonInteraction.editReply({ embeds: [errorEmbed] })
    }
}

const doCancel = async (interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction) => {
    await buttonInteraction.deferUpdate()
    await interaction.editReply({ embeds: [canceledEmbed.setFooter(await getQuarterDataFooter())], components: [] })
}

const addCollector = (interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })
    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction)
    })
}

const doReply = async (interaction: ChatInputCommandInteraction, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply({ ephemeral: true })

    assert(interaction.guild !== null)

    const roleIds = await getRoleIds()

    const associateMember = interaction.guild.members.cache.get(interaction.user.id)

    assert(associateMember !== undefined)

    if (!associateMember.roles.cache.has(roleIds.associateRole)) {
        await interaction.editReply({ embeds: [notAssociateEmbed] })
        return
    }

    const reply = await interaction.editReply({ embeds: [applyEmbed.setFooter(await getQuarterDataFooter())], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply)
}

export default { doReply }
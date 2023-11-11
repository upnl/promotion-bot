import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, InteractionResponse, Message } from "discord.js"
import { firebaseDb } from "../../db/firebase.js"
import { ASSOCIATE, MISSION_PROGRESS, QUARTER, REGULAR } from "../../db/collectionNames.js"
import { regularConverter } from "../../db/converters/regularConverter.js"
import { associateConverter } from "../../db/converters/associateConverter.js"
import { missionProgressConverter } from "../../db/converters/missionConverter.js"
import builders from "./builders.js"
import { errorEmbed } from "../utils/embeds/errorEmbed.js"
import { getQuarterDataString } from "../utils/quarterData/getQuarterData.js"

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
    await buttonInteraction.deferReply()

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
            await buttonInteraction.message.edit({ embeds: [successEmbed], components: [] })
        }
        else {
            await buttonInteraction.deferReply()
            await buttonInteraction.message.edit({ embeds: [duplicateEmbed], components: [] })
        }
    }
    catch (e) {
        console.error(e)
        await buttonInteraction.editReply({ embeds: [errorEmbed] })
    }
}

const doCancel = async (interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction) => {
    await buttonInteraction.deferUpdate()
    await buttonInteraction.message.edit({ embeds: [canceledEmbed], components: [] })
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
    const reply = await interaction.reply({ embeds: [applyEmbed], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply)
}

export default { doReply }
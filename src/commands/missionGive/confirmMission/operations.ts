import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, User } from "discord.js"
import { FieldValue } from "firebase-admin/firestore"
import { getMission, getMissionDocRef } from "../../../db/actions/missionActions.js"
import { ASSOCIATE, MISSION_PROGRESS, QUARTER } from "../../../db/collectionNames.js"
import { missionConverter, missionProgressConverter } from "../../../db/converters/missionConverter.js"
import { firebaseDb } from "../../../db/firebase.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { checkAssociate } from "../../utils/checks/checkAssociate.js"
import { addConfirmCollector, createConfirmActionRow } from "../../utils/components/confirmActionRow.js"
import { createMissionPreviewString, createMissionPreviewTitle } from "../../utils/createString/createMissionPreviewString.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { getQuarterDataFooter, getQuarterDataString } from "../../utils/quarterData/getQuarterData.js"
import builders from "./builders.js"

const {
    commandId,
    missionNotFoundEmbed,
    alreadyCompleteEmbed,
    successEmbedPrototype,
    cancelEmbedPrototype
} = builders

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("대상", true),
    isUniversal: interaction.options.getBoolean("공통조건여부", true),
    category: interaction.options.getString("카테고리", true),
    index: interaction.options.getNumber("번호", true) - 1
})

const onConfirm = (interaction: ChatInputCommandInteraction, target: User, isUniversal: boolean, category: string, index: number, mission: Mission) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferReply({ ephemeral: true })

        const result = firebaseDb.runTransaction(async transaction => {
            const missionDocRef = await getMissionDocRef(interaction.user.id, isUniversal ? interaction.user.id : target.id, category, index, transaction)
            const missionProgressDocRef = firebaseDb
                .collection(QUARTER).doc(await getQuarterDataString())
                .collection(ASSOCIATE).doc(target.id)
                .collection(MISSION_PROGRESS).doc(interaction.user.id)
                .withConverter(missionProgressConverter)

            if (missionDocRef === null || missionDocRef === undefined)
                return missionDocRef

            const mission = await transaction.get(missionDocRef.withConverter(missionConverter)).then(snapshot => snapshot.data())

            if (mission === undefined)
                return undefined

            await transaction.update(missionDocRef, { completed: FieldValue.arrayUnion(target.id) })
            await transaction.update(missionProgressDocRef, { currentScore: FieldValue.increment(mission.score) })
        })

        if (result === null || result === undefined) {
            await buttonInteraction.editReply({ embeds: [errorEmbed] })
            return
        }

        const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

        await buttonInteraction.deleteReply()
        await interaction.editReply({ embeds: [successEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }

const onCancel = (interaction: ChatInputCommandInteraction, target: User, mission: Mission) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferUpdate()

        const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

        await interaction.editReply({ embeds: [cancelEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }

export const doReply = async (
    interaction: ChatInputCommandInteraction,
    target: User, isUniversal: boolean, category: string, index: number,
    isEditing: boolean = false
) => {
    if (!isEditing)
        await interaction.deferReply({ ephemeral: true })

    if (!await checkAssociate(interaction, target.id, true))
        return

    const mission = await getMission(interaction.user.id, isUniversal ? interaction.user.id : target.id, category, index)

    if (mission === null) {
        await interaction.editReply({ embeds: [missionNotFoundEmbed.setFooter(await getQuarterDataFooter())] })
        return
    }
    if (mission === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }
    if (mission.completed.includes(target.id)) {
        await interaction.editReply({ embeds: [alreadyCompleteEmbed.setFooter(await getQuarterDataFooter())] })
        return
    }

    const reply = await interaction.editReply({
        embeds: [new EmbedBuilder()
            .setTitle(`${target.displayName}의 승격조건 달성을 확인합니까?`)
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })
            .setFooter(await getQuarterDataFooter())],
        components: [createConfirmActionRow(commandId, interaction.user)]
    });

    if (!isEditing)
        addConfirmCollector(
            commandId, interaction, reply,
            onConfirm(interaction, target, isUniversal, category, index, mission),
            onCancel(interaction, target, mission)
        )
}
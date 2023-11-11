import builders from "./builders.js"
import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User } from "discord.js"
import { getAssociate, getRegular } from "../../../db/actions/memberActions.js"
import { getMission, getMissionDocRef } from "../../../db/actions/missionActions.js"
import { errorEmbed } from "../../utils/embeds/errorEmbed.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { FieldValue } from "firebase-admin/firestore"
import { createMissionPreviewString, createMissionPreviewTitle } from "../../utils/createString/createMissionPreviewString.js"
import { firebaseDb } from "../../../db/firebase.js"
import { missionConverter, missionProgressConverter } from "../../../db/converters/missionConverter.js"
import { ASSOCIATE, MISSION_PROGRESS, QUARTER } from "../../../db/collectionNames.js"
import { getQuarterDataString } from "../../utils/quarterData/getQuarterData.js"

const {
    notRegularEmbed,
    notAssociateEmbed,
    missionNotFoundEmbed,
    alreadyCompleteEmbed,
    successEmbedPrototype,
    cancelEmbedPrototype,
    confirmButtonId,
    cancelButtonId,
    actionRow
} = builders

const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("대상", true),
    isUniversal: interaction.options.getBoolean("공통조건여부", true),
    category: interaction.options.getString("카테고리", true),
    index: interaction.options.getNumber("번호", true) - 1
})

const doConfirm = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    target: User, isUniversal: boolean, category: string, index: number,
    mission: Mission
) => {
    await buttonInteraction.deferReply()

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
    await buttonInteraction.message.edit({ embeds: [successEmbed], components: [] })
}

const doCancel = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    target: User, isUniversal: boolean, category: string, index: number,
    mission: Mission
) => {
    await buttonInteraction.deferUpdate()

    const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
        .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

    await buttonInteraction.message.edit({ embeds: [cancelEmbed], components: [] })
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    target: User, isUniversal: boolean, category: string, index: number,
    mission: Mission
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })

    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, target, isUniversal, category, index, mission)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, target, isUniversal, category, index, mission)
    })
}

const doReply = async (
    interaction: ChatInputCommandInteraction,
    target: User, isUniversal: boolean, category: string, index: number,
    isEditing: boolean = false
) => {
    if (!isEditing)
        await interaction.deferReply()

    if (await getRegular(interaction.user.id) === undefined) {
        await interaction.editReply({ embeds: [notRegularEmbed] })
        return
    }
    else if (await getAssociate(target.id) === undefined) {
        await interaction.editReply({ embeds: [notAssociateEmbed] })
        return
    }

    const mission = await getMission(interaction.user.id, isUniversal ? interaction.user.id : target.id, category, index)

    if (mission === null) {
        await interaction.editReply({ embeds: [missionNotFoundEmbed] })
        return
    }
    if (mission === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }
    if (mission.completed.includes(target.id)) {
        await interaction.editReply({ embeds: [alreadyCompleteEmbed] })
        return
    }

    const replyEmbed = new EmbedBuilder()
        .setTitle(`${target.displayName}의 승격조건 달성을 확인합니까?`)
        .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })
    const reply = await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply, target, isUniversal, category, index, mission)
}

export default {
    readOptions,
    doReply
}
﻿import { getMissionAll } from "../../../db/actions/missionActions.js"
import { getMissionProgress } from "../../../db/actions/missionProgressActions.js"
import { checkAssociate } from "../../utils/checkRole/checkAssociate.js"
import { createMissionMapPrintString, createProgressPrintString } from "../../utils/createString/createMissionPrintString.js"
import { errorEmbed } from "../../utils/embeds/errorEmbed.js"
import builders from "./builders.js"
import { ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User, UserSelectMenuInteraction } from "discord.js"

const {
} = builders

const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("준회원", true)
})

const doReply = async (interaction: ChatInputCommandInteraction, target: User, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply()

    if (!await checkAssociate(interaction, target.id))
        return

    const progress = await getMissionProgress(interaction.user.id, target.id)
    const missions = await getMissionAll(interaction.user.id, target.id)
    if (missions === undefined || progress === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }
    const [missionUniversal, missionSpecific] = missions

    const replyString = "```markdown\n" +
        `# ${target.displayName}의 승격 조건 : ${interaction.user.displayName}\n` +
        `## 달성 현황\n${createProgressPrintString(progress.currentScore, progress.goalScore)}\n` +
        `## 공통 조건\n${createMissionMapPrintString(missionUniversal, target.id)}\n` +
        `## 개인 조건\n${createMissionMapPrintString(missionSpecific, target.id)}` +
        "```"

    const reply = await interaction.editReply(replyString)
}

export default {
    readOptions,
    doReply
}
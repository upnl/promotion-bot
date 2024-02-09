import { ChatInputCommandInteraction, User } from "discord.js"
import { getMissionAll } from "../../../db/actions/missionActions.js"
import { getMissionProgress } from "../../../db/actions/missionProgressActions.js"
import { checkAssociate } from "../../utils/checks/checkAssociate.js"
import { createMissionMapPrintString, createProgressPrintString } from "../../utils/createString/createMissionPrintString.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("준회원", true)
})

export const doReply = async (interaction: ChatInputCommandInteraction, target: User, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply({ephemeral: true})

    if (!await checkAssociate(interaction, target.id))
        return

    const progress = await getMissionProgress(interaction.user.id, target.id)
    const missionUniversal = await getMissionAll(interaction.user.id, interaction.user.id)
    const missionSpecific = await getMissionAll(interaction.user.id, target.id)
    if (missionUniversal === undefined || missionSpecific === undefined || progress === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }

    const replyString = "```markdown\n" +
        `# ${target.displayName}의 승격 조건 : ${interaction.user.displayName}\n\n` +
        `## 달성 현황\n${createProgressPrintString(progress.currentScore, progress.goalScore)}\n\n` +
        `## 공통 조건\n${createMissionMapPrintString(missionUniversal, target.id)}\n\n` +
        `## 개인 조건\n${createMissionMapPrintString(missionSpecific, target.id)}` +
        "```"

    const reply = await interaction.editReply(replyString)
}
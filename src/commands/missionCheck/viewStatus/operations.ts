import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js"
import { errorEmbed } from "../../utils/embeds/errorEmbed.js"
import { getMissionProgressAll } from "../../../db/actions/missionProgressActions.js"
import { createProgressString } from "../../utils/createString/createMissionString.js"

const doReply = async (interaction: ChatInputCommandInteraction, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply()

    const progresses = await getMissionProgressAll(interaction.client, interaction.user.id)
    if (progresses === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }

    const replyEmbed = new EmbedBuilder()
        .setTitle(`${interaction.user.displayName}의 승격조건 : 현황`)
        .addFields(progresses.map(progress => ({
            name: (progress.currentScore > progress.goalScore ? ":white_check_mark:" : ":white_square_button:") + " " + progress.giverName,
            value: `달성 현황: ${createProgressString(progress.currentScore, progress.goalScore)}`,
            inline: false
        })))

    await interaction.editReply({ embeds: [replyEmbed] })
}

export default {
    doReply
}
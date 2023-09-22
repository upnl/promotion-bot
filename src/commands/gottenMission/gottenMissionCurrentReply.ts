import assert from "assert"
import { EmbedBuilder, Interaction } from "discord.js"

export const gottenMissionCurrentReply = async (interaction: Interaction) => {
    assert(interaction.isRepliable())

    const embed = new EmbedBuilder()
        .setTitle("아무개의 승격 조건: 현황")
        .addFields([
            { name: ":white_square_button: 박지호", value: "달성 현황: :large_blue_diamond:" + ":green_square:".repeat(6) + ":black_large_square:".repeat(2) + ":large_blue_diamond:" + " (1.5점 / 2점)", inline: false },
            { name: ":white_square_button: 작히보", value: "달성 현황: :large_blue_diamond:" + ":green_square:".repeat(0) + ":black_large_square:".repeat(8) + ":large_blue_diamond:" + " (1점 / 100점)", inline: false },
            { name: ":white_check_mark: 학비조", value: "달성 현황: :large_blue_diamond:" + ":green_square:".repeat(8) + ":large_blue_diamond:" + " (34점 / 30점)", inline: false },
        ])
        .setTimestamp()
        .setFooter({ text: 'Prommy by coinmoles' })

    await interaction.reply({ embeds: [embed] })
}
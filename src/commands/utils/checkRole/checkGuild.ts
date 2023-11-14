import { ChatInputCommandInteraction } from "discord.js"
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js"
import { notInGuildEmbed } from "../embeds/errorEmbed.js"

export const checkGuild = async (interaction: ChatInputCommandInteraction, components?: ReplyComponents[]): Promise<boolean> => {
    if (interaction.guild === null) {
        await interaction.reply({ embeds: [notInGuildEmbed], components })
        return false
    }

    return true
}
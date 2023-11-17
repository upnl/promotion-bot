import { ChatInputCommandInteraction } from "discord.js"
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js"
import { notInGuildEmbed } from "../errorEmbeds.js"

export const checkGuild = async (interaction: ChatInputCommandInteraction, components?: ReplyComponents[]): Promise<boolean> => {
    if (interaction.guild === null || interaction.guild.id !== process.env.GUILD_ID) {
        await interaction.reply({ embeds: [notInGuildEmbed], components })
        return false
    }

    return true
}
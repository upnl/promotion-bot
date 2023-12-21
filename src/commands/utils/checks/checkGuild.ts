import { ChatInputCommandInteraction } from "discord.js"
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js"
import { notInGuildEmbed } from "../errorEmbeds.js"
import { editOrReply } from "../editOrReply.js"

export const checkGuild = async (interaction: ChatInputCommandInteraction, components?: ReplyComponents[]): Promise<boolean> => {
    if (interaction.guild === null || interaction.guild.id !== process.env.GUILD_ID) {
        await editOrReply(interaction, { embeds: [notInGuildEmbed], components, ephemeral: true })
        return false
    }

    return true
}
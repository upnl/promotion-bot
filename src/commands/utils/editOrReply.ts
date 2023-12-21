import { ChatInputCommandInteraction, InteractionReplyOptions } from "discord.js";

export const editOrReply = async (interaction: ChatInputCommandInteraction, option: InteractionReplyOptions, ephemeral?: boolean) => {
    if (interaction.replied)
        return await interaction.editReply(option)
    else
        return await interaction.reply({ ...option, ephemeral, fetchReply: ephemeral })
}
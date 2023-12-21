import { ChatInputCommandInteraction, InteractionReplyOptions } from "discord.js";

export const editOrReply = async (interaction: ChatInputCommandInteraction, option: InteractionReplyOptions) => {
    if (interaction.replied)
        await interaction.editReply(option)
    else
        await interaction.reply(option)
}
import { InteractionReplyOptions, RepliableInteraction } from "discord.js";

export const editOrReply = async (interaction: RepliableInteraction, option: InteractionReplyOptions) => {
    if (interaction.replied || interaction.deferred)
        return await interaction.editReply(option)
    else
        return await interaction.reply(option)
}
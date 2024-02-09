import { ChatInputCommandInteraction } from "discord.js";
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js";
import { testEmbed } from "../errorEmbeds.js";
import { editOrReply } from "../editOrReply.js";

export const checkDeveloper = async (interaction: ChatInputCommandInteraction, components?: ReplyComponents[]) => {
    if (interaction.user.id !== process.env.DEV_ID && interaction.user.id !== process.env.DEV_ID2) {
        await editOrReply(interaction, { embeds: [testEmbed], components, ephemeral: true })
        return false
    }

    return true
}
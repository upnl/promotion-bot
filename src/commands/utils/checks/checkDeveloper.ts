import { ChatInputCommandInteraction } from "discord.js";
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js";
import { testEmbed } from "../errorEmbeds.js";
import { editOrReply } from "../editOrReply.js";

export const checkDeveloper = async (interaction: ChatInputCommandInteraction, components?: ReplyComponents[]) => {
    if (interaction.user.id !== "772050469430099989") {
        await editOrReply(interaction, { embeds: [testEmbed], components, ephemeral: true })
        return false
    }

    return true
}
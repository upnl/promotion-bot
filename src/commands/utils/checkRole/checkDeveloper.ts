import { ChatInputCommandInteraction } from "discord.js";
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js";
import { testEmbed } from "../embeds/errorEmbed.js";

export const checkDeveloper = async (interaction: ChatInputCommandInteraction, components?: ReplyComponents[]) => {
    if (interaction.user.id !== "772050469430099989") {
        await interaction.reply({ embeds: [testEmbed], components })
        return false
    }

    return true
}
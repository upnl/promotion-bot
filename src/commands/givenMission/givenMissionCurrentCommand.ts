import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";

const name = "현황"
const description = "승격조건 제시 현황을 확인합니다"

export const givenMissionCurrentCommand: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description),
    callback: async interaction => { },
    setup: []
}
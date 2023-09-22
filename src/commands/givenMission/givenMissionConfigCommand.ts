import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";

const name = "설정"
const description = "승격조건 관련 설정을 합니다"

export const givenMissionConfigCommand: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addNumberOption(option => option.setName("점수").setDescription("승격동의에 필요한 점수를 설정합니다")),
    callback: async interaction => { },
    setup: []
}
import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";

const name = "목록"
const description = "승격조건 목록을 확인합니다"

export const givenMissionGetCommand: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("준회원").setDescription("특정 준회원에게 제시한 승격조건 목록을 확인합니다.")),
    callback: async interaction => { },
    setup: []
}
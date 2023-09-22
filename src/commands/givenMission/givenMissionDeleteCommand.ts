import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";

const name = "삭제"
const description = "승격조건을 삭제합니다"

export const givenMissionDeleteCommand: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addNumberOption(option => option.setName("번호").setDescription("삭제할 승격조건 번호 (0-base)").setRequired(true))
        .addUserOption(option => option.setName("준회원").setDescription("특정 준회원의 승격조건을 삭제합니다. 명시하지 않을 경우 공통 조건을 삭제합니다")),
    callback: async interaction => { },
    setup: []
}
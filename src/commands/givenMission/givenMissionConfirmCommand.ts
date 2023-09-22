import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";

const name = "컨펌"
const description = "승격조건 달성을 확인합니다"

export const givenMissionConfirmCommand: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addBooleanOption(option => option.setName("공통조건여부").setDescription("달성한 조건이 공통조건이면 True, 개인조건이면 False").setRequired(true))
        .addNumberOption(option => option.setName("번호").setDescription("달성한 승격조건 번호 (0-base)").setRequired(true))
        .addUserOption(option => option.setName("준회원").setDescription("승격조건을 달성한 준회원").setRequired(true)),
    callback: async interaction => { },
    setup: []
}
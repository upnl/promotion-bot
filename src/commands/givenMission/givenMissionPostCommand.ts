import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";

const name = "추가"
const description = "새로운 승격조건을 추가합니다"

export const givenMissionPostCommand: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option => option.setName("내용").setDescription("추가할 승격조건 내용").setRequired(true))
        .addStringOption(option => option.setName("비고").setDescription("추가할 승격조건 관련 사설이 있다면 추가"))
        .addNumberOption(option => option.setName("점수").setDescription("추가할 승격조건 점수 (기본 1점)"))
        .addUserOption(option => option.setName("준회원").setDescription("특정 준회원의 승격조건을 추가합니다. 명시하지 않을 경우 공통 조건을 추가합니다")),
    callback: async interaction => { },
    setup: []
}
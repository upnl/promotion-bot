import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";

const name = "수정"
const description = "승격조건의 내용 및 점수를 수정합니다"

export const givenMissionPatchCommand: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addNumberOption(option => option.setName("번호").setDescription("수정할 승격조건 번호 (0-base)").setRequired(true))
        .addStringOption(option => option.setName("내용").setDescription("수정 후 승격조건 내용"))
        .addNumberOption(option => option.setName("점수").setDescription("수정 후 승격조건 점수"))
        .addUserOption(option => option.setName("준회원").setDescription("특정 준회원의 승격조건을 수정합니다. 명시하지 않을 경우 공통 조건을 수정합니다")),
    callback: async interaction => { },
    setup: []
}
import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "수정"
const description = "승격조건의 내용 및 점수를 수정합니다"

const patchMission: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("대상").setDescription("수정할 승격조건 대상, 공통 조건을 수정하는 경우 자기 자신을 입력").setRequired(true))
        .addStringOption(option => option.setName("카테고리").setDescription("수정할 승격조건 카테고리, 카테고리가 없는 경우 \"공통 조건\" 또는 \"개인 조건\" 입력").setRequired(true))
        .addNumberOption(option => option.setName("번호").setDescription("수정할 승격조건 번호 (1-base)").setRequired(true))
        .addStringOption(option => option.setName("내용").setDescription("수정 후 승격조건 내용"))
        .addStringOption(option => option.setName("비고").setDescription("수정 후 승격조건 비고"))
        .addNumberOption(option => option.setName("점수").setDescription("수정 후 승격조건 점수")),
    callback: reply
}

export default patchMission
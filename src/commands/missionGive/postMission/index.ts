import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "추가"
const description = "새로운 승격조건을 추가합니다"

const postMission: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("대상").setDescription("추가할 승격조건 대상, 공통 조건을 추가하는 경우 자기 자신을 입력").setRequired(true))
        .addStringOption(option => option.setName("내용").setDescription("추가할 승격조건 내용").setRequired(true))
        .addStringOption(option => option.setName("카테고리").setDescription("추가할 승격조건 카테고리"))
        .addStringOption(option => option.setName("비고").setDescription("추가할 승격조건 비고"))
        .addNumberOption(option => option.setName("점수").setDescription("추가할 승격조건 점수, 명시하지 않을 경우 1점")),
    callback: reply
}

export default postMission
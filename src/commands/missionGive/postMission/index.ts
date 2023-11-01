import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "추가"
const description = "새로운 승격조건을 추가합니다"

const postMission: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("대상").setDescription("공통 조건을 추가하고 싶을 경우 자신").setRequired(true))
        .addStringOption(option => option.setName("내용").setDescription("추가할 승격조건 내용").setRequired(true))
        .addStringOption(option => option.setName("카테고리").setDescription("명시하지 않을 경우 \"공통 조건\" 또는 \"개인 조건\""))
        .addStringOption(option => option.setName("비고").setDescription("비고"))
        .addNumberOption(option => option.setName("점수").setDescription("명시하지 않을 경우 1점")),
    callback: reply,
    setup: []
}

export default postMission
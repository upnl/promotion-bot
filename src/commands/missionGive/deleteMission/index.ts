import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "삭제"
const description = "승격조건을 삭제합니다"

const deleteMission: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("대상").setDescription("공통 조건을 삭제하는 경우 자신을 입력").setRequired(true))
        .addStringOption(option => option.setName("카테고리").setDescription("삭제할 승격조건 카테고리").setRequired(true))
        .addNumberOption(option => option.setName("번호").setDescription("삭제할 승격조건 번호 (1-base)").setRequired(true)),
    callback: reply,
    setup: []
}

export default deleteMission
import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "출력"
const description = "제시한 승격조건을 마크다운 문서로 출력합니다"

const printMission: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("준회원").setDescription("승격조건을 출력할 준회원").setRequired(true)),
    callback: reply
}

export default printMission
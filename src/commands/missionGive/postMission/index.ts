import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "추가"
const description = "새로운 승격조건을 추가합니다"

const postMission: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("대상").setDescription("추가할 승격조건 대상, 공통 조건을 추가하는 경우 자기 자신을 입력").setRequired(true)),
    callback: reply
}

export default postMission
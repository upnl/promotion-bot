import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "설정"
const description = "승격조건 관련 설정을 합니다"

const config: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addNumberOption(option => option.setName("목표점수").setDescription("승격동의까지 필요한 점수").setRequired(true)),
    callback: reply
}

export default config
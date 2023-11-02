import reply from "./reply.js"
import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";

const name = "현황"
const description = "승격조건 달성 현황을 확인합니다"

const viewCurrent: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description),
    callback: reply
}

export default viewCurrent
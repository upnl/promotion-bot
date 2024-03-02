import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { CommandType } from "../../interfaces/commands/CommandTypes.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import reply from "./reply.js";

const name = "승격신청"
const description = "승격신청을 합니다"

const apply: SlashCommandContainer = {
    commandType: CommandType.Associate,
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description),
    callback: reply,
    isApply: true
}

export default apply
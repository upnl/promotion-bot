import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";

const name = "도움말"
const description = "커맨드 목록을 표시합니다"

const help: SlashCommandContainer = {
    commandType: "공통",
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description),
    callback: reply
}

export default help
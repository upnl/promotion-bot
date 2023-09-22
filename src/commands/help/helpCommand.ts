import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import { setupCommandCallback } from "../utils/setupCommandCallback.js";
import { helpReply } from "./helpReply.js";

const name = "도움말"
const description = "커맨드 목록을 표시합니다"

export const helpCommand: SlashCommandContainer = {
    commandType: "공통",
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description),
    subcommands: [],
    setup: [setupCommandCallback(name, helpReply)]
}
﻿import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import { CommandType } from "../../interfaces/commands/CommandTypes.js";

const name = "도움말"
const description = "커맨드 목록을 표시합니다"

const help: SlashCommandContainer = {
    commandType: CommandType.Public,
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description),
    callback: reply
}

export default help
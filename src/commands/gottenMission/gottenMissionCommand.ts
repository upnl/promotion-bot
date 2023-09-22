import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import { executeSubcommand } from "../utils/executeSubcommand.js";
import { setupCommandCallback } from "../utils/setupCommandCallback.js";
import { setupSubcommands } from "../utils/setupSubcommands.js";
import { gottenMissionCurrentCommand } from "./gottenMissionCurrentCommand.js";
import { gottenMissionGetCommand } from "./gottenMissionGetCommand.js";

const name = "승격조건-확인"
const description = "(준회원 전용) 승격조건을 확인합니다"

const subcommands = [
    gottenMissionCurrentCommand,
    gottenMissionGetCommand
]

export const gottenMissionCommand: SlashCommandContainer = {
    commandType: "준회원",
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addSubcommands(subcommands.map(subcommand => subcommand.builder)),
    subcommands,
    setup: [
        setupCommandCallback(name, executeSubcommand(subcommands)),
        setupSubcommands(subcommands)
    ]
}
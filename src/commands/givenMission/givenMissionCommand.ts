import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import { givenMissionGetCommand } from "./givenMissionGetCommand.js";
import { givenMissionPostCommand } from "./givenMissionPostCommand.js";
import { givenMissionPatchCommand } from "./givenMissionPatchCommand.js";
import { givenMissionConfirmCommand } from "./givenMissionConfirmCommand.js";
import { givenMissionDeleteCommand } from "./givenMissionDeleteCommand.js";
import { givenMissionConfigCommand } from "./givenMissionConfigCommand.js";
import { givenMissionCurrentCommand } from "./givenMissionCurrentCommand.js";
import { givenMissionPrintCommand } from "./givenMissionPrintCommnad.js";
import { setupSubcommands } from "../utils/setupSubcommands.js";
import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { executeSubcommand } from "../utils/executeSubcommand.js";
import { setupCommandCallback } from "../utils/setupCommandCallback.js";

const name = "승격조건-제시"

const description = "(정회원 전용) 승격조건을 제시합니다"

const subcommands = [
    givenMissionCurrentCommand,
    givenMissionConfigCommand,
    givenMissionGetCommand,
    givenMissionPostCommand,
    givenMissionDeleteCommand,
    givenMissionPatchCommand,
    givenMissionConfirmCommand,
    givenMissionPrintCommand
]

export const givenMissionCommand: SlashCommandContainer = {
    commandType: "정회원",
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
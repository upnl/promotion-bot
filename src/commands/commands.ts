import { SlashCommandContainer } from "../interfaces/commands/CommandContainer.js";
import { givenMissionCommand } from "./givenMission/givenMissionCommand.js";
import { gottenMissionCommand } from "./gottenMission/gottenMissionCommand.js";
import { helpCommand } from "./help/helpCommand.js";

export const commands: SlashCommandContainer[] = [
    helpCommand,
    givenMissionCommand,
    gottenMissionCommand
]
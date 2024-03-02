import { SlashCommandSubcommandsOnlyContainer } from "../../interfaces/commands/CommandContainer.js";
import { CommandType } from "../../interfaces/commands/CommandTypes.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import config from "./config/index.js";
import confirmMission from "./confirmMission/index.js";
import deleteMission from "./deleteMission/index.js";
import patchMission from "./patchMission/index.js";
import postMission from "./postMission/index.js";
import printMission from "./printMission/index.js";
import viewMissionList from "./viewMissionList/index.js";
import viewMissionStatus from "./viewMissionStatus/index.js"

const name = "제시"
const description = "승격조건을 제시합니다"

const subcommands = [
    config,
    viewMissionList,
    viewMissionStatus,
    postMission,
    deleteMission,
    patchMission,
    confirmMission,
    printMission,
]

const missionGive: SlashCommandSubcommandsOnlyContainer = {
    commandType: CommandType.Regular,
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addSubcommands(subcommands.map(subcommand => subcommand.builder)),
    subcommands
}

export default missionGive
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import viewMissionList from "./viewMissionList/index.js";
import postMission from "./postMission/index.js";
import patchMission from "./patchMission/index.js";
import confirmMission from "./confirmMission/index.js";
import deleteMission from "./deleteMission/index.js";
import config from "./config/index.js";
import printMission from "./printMission/index.js";
import { setupSubcommands } from "../utils/setupSubcommands.js";
import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { executeSubcommand } from "../utils/executeSubcommand.js";
import { setupCommandCallback } from "../utils/setupCommandCallback.js";

const name = "제시"
const description = "승격조건을 제시합니다"

const subcommands = [
    config,
    viewMissionList,
    postMission,
    deleteMission,
    patchMission,
    confirmMission,
    printMission
]

const missionGive: SlashCommandContainer = {
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

export default missionGive
import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import { executeSubcommand } from "../utils/executeSubcommand.js";
import { setupCommandCallback } from "../utils/setupCommandCallback.js";
import { setupSubcommands } from "../utils/setupSubcommands.js";
import viewStatus from "./viewStatus/index.js";
import viewList from "./viewList/index.js";

const name = "확인"
const description = "받은 승격조건을 확인합니다"

const subcommands = [
    viewStatus,
    viewList
]

const missionCheck: SlashCommandContainer = {
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

export default missionCheck
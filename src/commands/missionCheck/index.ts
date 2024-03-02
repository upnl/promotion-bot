import { SlashCommandSubcommandsOnlyContainer } from "../../interfaces/commands/CommandContainer.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import viewStatus from "./viewStatus/index.js";
import viewList from "./viewList/index.js";
import { CommandType } from "../../interfaces/commands/CommandTypes.js";

const name = "확인"
const description = "받은 승격조건을 확인합니다"

const subcommands = [
    viewStatus,
    viewList
]

const missionCheck: SlashCommandSubcommandsOnlyContainer = {
    commandType: CommandType.Associate,
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addSubcommands(subcommands.map(subcommand => subcommand.builder)),
    subcommands
}

export default missionCheck
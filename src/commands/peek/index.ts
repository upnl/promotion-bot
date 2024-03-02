import {
  SlashCommandContainer,
  SlashCommandSubcommandsOnlyContainer,
} from "../../interfaces/commands/CommandContainer.js";
import { CommandType } from "../../interfaces/commands/CommandTypes.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";

const name = "엿보기";
const description = "자신 외의 정회원 또는 준회원이 받은 승격조건을 확인합니다";

const subcommands = [];

const peek: SlashCommandContainer = {
  commandType: CommandType.Public,
  builder: new MySlashCommandBuilder()
    .setName(name)
    .setDescription(description),
  callback: async () => {},
};

export default peek;

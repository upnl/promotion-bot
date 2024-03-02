import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { CommandType } from "../../interfaces/commands/CommandTypes.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import reply from "./reply.js";

const name = "엿보기";
const description =
  "자신 외의 정회원 또는 준회원이 받은 승격조건을 확인합니다.";

const peek: SlashCommandContainer = {
  commandType: CommandType.Public,
  builder: new MySlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addUserOption((option) =>
      option.setName("정회원").setDescription("승격조건 목록을 확인할 정회원")
    )
    .addUserOption((option) =>
      option.setName("준회원").setDescription("승격조건 목록을 확인할 준회원")
    ),
  callback: reply,
};

export default peek;

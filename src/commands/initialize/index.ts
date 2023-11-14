import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import reply from "./reply.js";

const name = "개시"
const description = "봇을 작동시킵니다"

const initialize: SlashCommandContainer = {
    commandType: "서버장",
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addRoleOption(option => option.setName("넬장").setDescription("넬장 롤").setRequired(true))
        .addRoleOption(option => option.setName("정회원").setDescription("정회원 롤").setRequired(true))
        .addRoleOption(option => option.setName("준회원").setDescription("준회원 롤").setRequired(true)),
    callback: reply
}

export default initialize
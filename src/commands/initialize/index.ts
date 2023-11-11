import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import reply from "./reply.js";

const name = "init"
const description = "Initialize Roles"

const initialize: SlashCommandContainer = {
    commandType: "특수",
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addMentionableOption(option => option.setName("넬장").setDescription("넬장 롤"))
        .addMentionableOption(option => option.setName("정회원").setDescription("정회원 롤"))
        .addMentionableOption(option => option.setName("준회원").setDescription("준회원 롤")),
    callback: reply
}

export default initialize
import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import reply from "./reply.js";

const name = "분기시작"
const description = "새 분기를 시작합니다"

const progressQuarter: SlashCommandContainer = {
    commandType: "넬장",
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addRoleOption(option => option.setName("정회원").setDescription("정회원 롤").setRequired(true))
        .addRoleOption(option => option.setName("준회원").setDescription("준회원 롤").setRequired(true)),
    callback: reply
}

export default progressQuarter
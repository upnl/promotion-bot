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
        .addIntegerOption(option => option.setName("년도").setDescription("입력하는 경우 분기도 입력해야 함"))
        .addIntegerOption(option => option.setName("분기").setDescription("입력하는 경우 연도도 입력해야 함")),
    callback: reply
}

export default progressQuarter
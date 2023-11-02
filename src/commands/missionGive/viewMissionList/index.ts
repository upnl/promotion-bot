import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "목록"
const description = "제시한 승격조건 목록을 확인합니다"

const viewMissionList: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("준회원").setDescription("특정 준회원에게 제시한 승격조건 목록을 확인합니다. 자기 자신을 입력하면 공통조건만을 확인합니다")),
    callback: reply
}

export default viewMissionList
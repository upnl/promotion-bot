﻿import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "현황"
const description = "승격조건 제시 현황을 확인합니다"

const viewMissionStatus: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description),
    callback: reply
}

export default viewMissionStatus
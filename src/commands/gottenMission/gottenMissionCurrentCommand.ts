import { SlashCommandSubcommandBuilder } from "discord.js";
import { gottenMissionCurrentReply } from "./gottenMissionCurrentReply.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { setupCommandCallback } from "../utils/setupCommandCallback.js";

const name = "현황"
const description = "승격조건 달성 현황을 확인합니다"

export const gottenMissionCurrentCommand: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description),
    callback: gottenMissionCurrentReply,
    setup: []
}
import { SlashCommandSubcommandBuilder } from "discord.js";
import { gottenMissionGetMenu, gottenMissionGetReply } from "./gottenMissionGetReply.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { messageComponentCallbackMap } from "../interactionCallbackMaps.js";
import { setupCommandCallback } from "../utils/setupCommandCallback.js";

const name = "목록"
const description = "승격조건 목록을 확인합니다"

export const gottenMissionGetCommand: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("정회원").setDescription("특정 정회원이 제시한 승격조건 목록을 확인합니다")),
    callback: gottenMissionGetReply,
    setup: [
        () => messageComponentCallbackMap.set(...gottenMissionGetMenu)
    ]
}
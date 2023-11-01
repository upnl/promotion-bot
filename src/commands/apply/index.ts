import { SlashCommandContainer } from "../../interfaces/commands/CommandContainer.js";
import { MySlashCommandBuilder } from "../MySlashCommandBuilder.js";
import { setupCommandCallback } from "../utils/setupCommandCallback.js";
import reply from "./reply.js";

const name = "승격신청"
const description = "승격신청을 합니다"

const apply: SlashCommandContainer = {
    commandType: "준회원",
    builder: new MySlashCommandBuilder()
        .setName(name)
        .setDescription(description),
    subcommands: [],
    setup: [setupCommandCallback(name, reply)]
}

export default apply
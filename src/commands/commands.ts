import { SlashCommandContainer, SlashCommandSubcommandsOnlyContainer } from "../interfaces/commands/CommandContainer.js";
import missionGive from "./missionGive/index.js";
import missionCheck from "./missionCheck/index.js";
import apply from "./apply/index.js";
import help from "./help/index.js";

export const commands: (SlashCommandContainer | SlashCommandSubcommandsOnlyContainer)[] = [
    help,
    apply,
    missionGive,
    missionCheck
]
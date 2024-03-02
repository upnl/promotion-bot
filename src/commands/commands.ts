import { SlashCommandContainer, SlashCommandSubcommandsOnlyContainer } from "../interfaces/commands/CommandContainer.js";
import missionGive from "./missionGive/index.js";
import missionCheck from "./missionCheck/index.js";
import apply from "./apply/index.js";
import help from "./help/index.js";
import progressQuarter from "./progressQuarter/index.js";
import initialize from "./initialize/index.js";
import peek from "./peek/index.js";

export const commands: (SlashCommandContainer | SlashCommandSubcommandsOnlyContainer)[] = [
    help,
    peek,
    apply,
    progressQuarter,
    missionGive,
    missionCheck,
    initialize
]
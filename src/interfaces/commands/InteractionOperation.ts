import { Interaction } from "discord.js";

export type InteractionOperation = (interaction: Interaction) => Promise<void>
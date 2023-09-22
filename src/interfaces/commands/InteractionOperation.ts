import { Client, Interaction } from "discord.js";

export type InteractionOperation = (interaction: Interaction) => Promise<void>
import { InteractionOperation } from "../interfaces/commands/InteractionOperation.js";

export const applicationCommandCallbackMap = new Map<string, InteractionOperation>()
export const messageComponentCallbackMap = new Map<string, InteractionOperation>()
import { InteractionOperation } from "../../interfaces/commands/InteractionOperation.js";
import { applicationCommandCallbackMap } from "../interactionCallbackMaps.js";

export const setupCommandCallback = (name: string, callback: InteractionOperation) => () => {
    applicationCommandCallbackMap.set(name, callback)
}
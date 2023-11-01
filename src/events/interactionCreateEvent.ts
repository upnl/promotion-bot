import { Events, InteractionType } from "discord.js";
import { EventContainer } from "../interfaces/events/EventContainer.js";
import { InteractionOperation } from "../interfaces/commands/InteractionOperation.js";
import { applicationCommandCallbackMap, messageComponentCallbackMap } from "../commands/interactionCallbackMaps.js";

const callback: InteractionOperation = async interaction => {
    if (interaction.type == InteractionType.ApplicationCommand) {
        const callback = applicationCommandCallbackMap.get(interaction.commandName)
        if (callback !== undefined)
            callback(interaction)
    }
    else if (interaction.type == InteractionType.MessageComponent) {
        const callback = messageComponentCallbackMap.get(interaction.customId)
        if (callback !== undefined)
            callback(interaction)
    }
}

export const interactionCreateEvent: EventContainer<Events.InteractionCreate> = {
    event: Events.InteractionCreate,
    callback
}
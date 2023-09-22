import { Events, InteractionType } from "discord.js";
import { EventContainer } from "../interfaces/events/EventContainer.js";
import { InteractionOperation } from "../interfaces/commands/InteractionOperation.js";
import { applicationCommandCallbackMap, messageComponentCallbackMap } from "../commands/interactionCallbackMaps.js";

const callback: InteractionOperation = async interaction => {
    if (interaction.type == InteractionType.ApplicationCommand)
        await (applicationCommandCallbackMap.get(interaction.commandName)!)(interaction)
    else if (interaction.type == InteractionType.MessageComponent)
        await (messageComponentCallbackMap.get(interaction.customId)!)(interaction)
}

export const interactionCreateEvent: EventContainer<Events.InteractionCreate> = {
    event: Events.InteractionCreate,
    callback
}
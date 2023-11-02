import { Events, InteractionType } from "discord.js";
import { SlashCommandContainer, SlashCommandSubcommandsOnlyContainer } from "../interfaces/commands/CommandContainer.js";
import { EventContainer } from "../interfaces/events/EventContainer.js";
import { InteractionOperation } from "../interfaces/commands/InteractionOperation.js";
import { commands } from "../commands/commands.js";

const callback: InteractionOperation = async interaction => {
    if (interaction.isChatInputCommand()) {
        const commandContainer = commands.filter(commandContainer => commandContainer.builder.name === interaction.commandName).shift()

        if (commandContainer === undefined)
            return

        else if ("callback" in commandContainer)
            await commandContainer.callback(interaction)
        else {
            const subcommandContainer = commandContainer.subcommands.filter(
                subcommandContainer => subcommandContainer.builder.name === interaction.options.getSubcommand()
            ).shift()

            if (subcommandContainer === undefined)
                return

            await subcommandContainer.callback(interaction)
        }
    }
}

export const interactionCreateEvent: EventContainer<Events.InteractionCreate> = {
    event: Events.InteractionCreate,
    callback
}
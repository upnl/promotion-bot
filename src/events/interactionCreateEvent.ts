import { Events } from "discord.js";
import { EventContainer } from "../interfaces/events/EventContainer.js";
import { InteractionOperation } from "../interfaces/commands/InteractionOperation.js";
import { commands } from "../commands/commands.js";
import { checkPermission } from "../commands/utils/checkRole/checkPermission.js";
import { checkGuild } from "../commands/utils/checkRole/checkGuild.js";
import { checkInitialized } from "../commands/utils/checkInitialized.js";
import { checkDeveloper } from "../commands/utils/checkRole/checkDeveloper.js";
import { isTesting } from "../isTesting.js";

const callback: InteractionOperation = async interaction => {
    if (interaction.isChatInputCommand()) {
        if (!await checkGuild(interaction))
            return
        if (interaction.commandName !== "개시" && !await checkInitialized(interaction))
            return

        const commandContainer = commands.filter(
            commandContainer => commandContainer.builder.name === interaction.commandName
        ).shift()
        if (commandContainer === undefined)
            return

        if (isTesting) {
            if (!await checkDeveloper(interaction))
                return
        }
        else {
            if (!commandContainer.isApply && !await checkPermission(interaction, commandContainer.commandType))
                return
        }

        if ("callback" in commandContainer)
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
import assert from "assert";
import { InteractionOperation } from "../../interfaces/commands/InteractionOperation.js";
import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";

export const executeSubcommand = (subcommands: SlashCommandSubcommandContainer[]): InteractionOperation => async interaction => {
    assert(interaction.isChatInputCommand())

    const callback = subcommands
        .find(subcommand => subcommand.builder.name == interaction.options.getSubcommand())!
        .callback

    await callback(interaction)
}
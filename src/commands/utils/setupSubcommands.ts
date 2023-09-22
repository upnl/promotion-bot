import { SlashCommandSubcommandContainer } from "../../interfaces/commands/CommandContainer.js";

export const setupSubcommands = (subcommands: SlashCommandSubcommandContainer[]) => () => {
    subcommands.forEach(subcommand => subcommand.setup.forEach(setupFunc => setupFunc()))
}
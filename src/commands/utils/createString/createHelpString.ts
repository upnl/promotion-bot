import { SlashCommandContainer, SlashCommandSubcommandsOnlyContainer } from "../../../interfaces/commands/CommandContainer.js"
import { commandTypes } from "../../../interfaces/commands/CommandTypes.js"
import { commands } from "../../commands.js"

export const createCommandHelpString = (command: SlashCommandContainer | SlashCommandSubcommandsOnlyContainer): string => {
    const mainCommandHelpString = `- \`/${command.builder.name}\` - ${command.builder.description}`
    if ("subcommands" in command)
        return mainCommandHelpString + "\n" +
            command.subcommands.map(
                subcommand => `  - \`${subcommand.builder.name}\` - ${subcommand.builder.description}`
            ).join("\n")
    else
        return mainCommandHelpString
}

export const createHelpEmbedFields = () => commandTypes
    .map(commandType => ({
        type: commandType,
        commands: commands.filter(command => command.commandType == commandType)
    }))
    .filter(commandsOfType => commandsOfType.commands.length > 0)
    .map(commandsAndType => ({
        name: commandsAndType.type,
        value: commandsAndType.commands.map(command => createCommandHelpString(command)).join("\n"),
        inline: false
    }))
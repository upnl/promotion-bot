import { EmbedBuilder } from "discord.js"
import { commandTypes } from "../../interfaces/commands/CommandTypes.js"
import { commands } from "../commands.js"

const createHelpEmbedFields = () => commandTypes
    .map(commandType => ({
        type: commandType,
        commands: commands.filter(command => command.commandType == commandType)
    }))
    .filter(commandsOfType => commandsOfType.commands.length > 0)
    .map(commandsAndType => ({
        name: commandsAndType.type,
        value:
            commandsAndType.commands.map(command =>
                [
                    `- \`/${command.builder.name}\` - ${command.builder.description}`,
                    ...(command.subcommands?.map(
                        subcommand => `  - \`${subcommand.builder.name}\` - ${subcommand.builder.description}`
                    ) ?? [])
                ].join("\n")
            ).join("\n"),
        inline: false
    }))

const createHelpEmbed = () => new EmbedBuilder().setTitle("도움말").addFields(createHelpEmbedFields())

export default { createHelpEmbed }
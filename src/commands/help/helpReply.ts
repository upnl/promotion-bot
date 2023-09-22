import assert from "assert"
import { EmbedBuilder, EmbedField, Interaction } from "discord.js"
import { commandTypes } from "../../interfaces/commands/CommandTypes.js"
import { commands } from "../commands.js"

export const helpReply = async (interaction: Interaction) => {
    assert(interaction.isRepliable())

    const helpEmbed = new EmbedBuilder()
        .setTitle("도움말")
        .setTimestamp()
        .addFields(createCommandDescriptionEmbedFields())
        .setFooter({ text: 'Prommy by coinmoles' })

    await interaction.reply({ embeds: [helpEmbed] })
}

const createCommandDescriptionEmbedFields = (): EmbedField[] => {
    return commandTypes
        .map(commandType => {
            return {
                type: commandType,
                commands: commands.filter(command => command.commandType == commandType)
            }
        })
        .filter(
            commandsOfType => commandsOfType.commands.length > 0
        )
        .map((commandsOfType, index, { length }) => {
            return {
                name: commandsOfType.type,
                value:
                    commandsOfType.commands.map(command =>
                        [
                            `- \`/${command.builder.name}\` - ${command.builder.description}`,
                            ...(command.subcommands?.map(
                                subcommand => `  - \`${subcommand.builder.name}\` - ${subcommand.builder.description}`
                            ) ?? [])
                        ].join("\n")
                    ).join("\n"),
                inline: false
            }
        })
}
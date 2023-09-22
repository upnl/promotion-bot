import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export class MySlashCommandBuilder extends SlashCommandBuilder {
    addSubcommands(inputs: (SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder))[]) {
        return inputs.reduce((builder: SlashCommandSubcommandsOnlyBuilder, subcommand) => builder.addSubcommand(subcommand), this)
    }
}

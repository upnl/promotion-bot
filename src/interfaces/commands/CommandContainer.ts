import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { CommandType } from "./CommandTypes.js";
import { InteractionOperation } from "./InteractionOperation.js";

export interface BaseCommandContainer {
    builder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandSubcommandBuilder;

    setup: (() => void)[]
}

export interface SlashCommandContainer extends BaseCommandContainer {
    commandType: CommandType;
    builder: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
    subcommands: SlashCommandSubcommandContainer[]
}

export interface SlashCommandSubcommandContainer extends BaseCommandContainer {
    builder: SlashCommandSubcommandBuilder;
    callback: InteractionOperation;
}
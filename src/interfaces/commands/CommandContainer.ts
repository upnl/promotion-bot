import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { CommandType } from "./CommandTypes.js";
import { InteractionOperation } from "./InteractionOperation.js";

export interface SlashCommandContainer {
    commandType: CommandType;
    builder: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;
    callback: InteractionOperation
}

export interface SlashCommandSubcommandsOnlyContainer {
    commandType: CommandType;
    builder: SlashCommandSubcommandsOnlyBuilder;
    subcommands: SlashCommandSubcommandContainer[]
}

export interface SlashCommandSubcommandContainer {
    builder: SlashCommandSubcommandBuilder;
    callback: InteractionOperation;
}
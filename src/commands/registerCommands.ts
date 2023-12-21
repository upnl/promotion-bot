import { Client, REST, Routes } from "discord.js";
import { commands } from "./commands.js";
import { isTesting } from "../isTesting.js";

export const registerCommands = async (client: Client) => {
    const rest = new REST().setToken(process.env.TOKEN!);

    try {
        if (isTesting)
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
                { body: commands.map(command => command.builder) }
            )
        else
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID!),
                { body: commands.map(command => command.builder) }
            )
    }
    catch (error) {
        console.log(`There was an error: ${error}`);
    }
}

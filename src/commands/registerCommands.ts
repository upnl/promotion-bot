import { Client, REST, Routes } from "discord.js";
import { commands } from "./commands.js";

const callAPI = async (client: Client) => {
    const rest = new REST().setToken(process.env.TOKEN!);

    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
            {
                body: commands.map(command => command.builder)
            }
        )
    }
    catch (error) {
        console.log(`There was an error: ${error}`);
    }
}

export const registerCommands = async (client: Client) => {
    commands.forEach(command => command.setup.forEach(setupFunc => setupFunc()))
    await callAPI(client)
}

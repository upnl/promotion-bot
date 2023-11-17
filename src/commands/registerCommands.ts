import { Client, REST, Routes } from "discord.js";
import { commands } from "./commands.js";

export const registerCommands = async (client: Client) => {
    const rest = new REST().setToken(process.env.PROMOTIONBOT_TOKEN!);

    try {
        await rest.put(
            Routes.applicationCommands(process.env.PROMOTIONBOT_CLIENT_ID!),
            {
                body: commands.map(command => command.builder)
            }
        )
    }
    catch (error) {
        console.log(`There was an error: ${error}`);
    }
}

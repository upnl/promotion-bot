import "./dotenvConfig.js";
import { Client, IntentsBitField } from "discord.js";
import { registerCommands } from "./commands/registerCommands.js";
import { registerEvents } from "./events/registerEvents.js";

const intents: IntentsBitField = new IntentsBitField()
    .add(IntentsBitField.Flags.Guilds)
    .add(IntentsBitField.Flags.GuildMessages);

(async () => {
    const client = new Client({ intents })

    await registerEvents(client)
    await registerCommands(client)

    await client.login(process.env.TOKEN)
})()
import "./dotenvConfig.js";
import { Client, IntentsBitField } from "discord.js";
import { registerEvents } from "./events/registerEvents.js";
import { registerCommands } from "./commands/registerCommands.js";

const intents: IntentsBitField = new IntentsBitField()
    .add(IntentsBitField.Flags.Guilds)
    .add(IntentsBitField.Flags.GuildMessages)
    .add(IntentsBitField.Flags.GuildPresences);

(async () => {
    const client = new Client({ intents })

    await registerEvents(client)
    await registerCommands(client)

    await client.login(process.env.PROMOTIONBOT_TOKEN)
})()
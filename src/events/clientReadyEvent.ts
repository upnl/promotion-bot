import { Client, Events } from "discord.js";
import { EventContainer } from "../interfaces/events/EventContainer.js";

const callback = async (client: Client) => {
    client.user?.setActivity("/도움말");
    console.log("Prommy is now online!");
}

export const clientReadyEvent: EventContainer<Events.ClientReady> = {
    event: Events.ClientReady,
    callback
}
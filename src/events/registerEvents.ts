import { Client, ClientEvents, Events } from "discord.js"
import { EventContainer } from "../interfaces/events/EventContainer.js"
import { clientReadyEvent } from "../events/clientReadyEvent.js"
import { interactionCreateEvent } from "../events/interactionCreateEvent.js"

const registerEvent = <K extends keyof ClientEvents>(client: Client, eventContainer: EventContainer<K>): Client => {
    return client.on(eventContainer.event, eventContainer.callback)
}


export const registerEvents = (client: Client) => {
    registerEvent(client, clientReadyEvent)
    registerEvent(client, interactionCreateEvent)
}
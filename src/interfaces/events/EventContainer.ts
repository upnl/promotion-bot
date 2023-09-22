import { Awaitable, Client, ClientEvents, Events } from "discord.js";

export interface EventContainer<K extends keyof ClientEvents> {
    event: K;
    callback: (...args: ClientEvents[K]) => Awaitable<void>
}
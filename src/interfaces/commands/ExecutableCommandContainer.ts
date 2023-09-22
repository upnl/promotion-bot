import { InteractionOperation } from "./InteractionOperation.js";

export interface ExecutableCommandContainer {
    builder: { name: string },
    callbacks: InteractionOperation[]
}
import assert from "assert";
import operations from "./operations.js"
import { InteractionOperation } from "../../interfaces/commands/InteractionOperation.js";

const { doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    await doReply(interaction)
}

export default reply
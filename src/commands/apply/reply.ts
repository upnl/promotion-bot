import assert from "assert";
import { InteractionOperation } from "../../interfaces/commands/InteractionOperation.js";
import operations from "./operations.js";

const { doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    await doReply(interaction)
}

export default reply
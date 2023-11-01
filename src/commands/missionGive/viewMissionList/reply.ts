import assert from "assert"
import operations from "./operations.js"
import { InteractionOperation } from "../../../interfaces/commands/InteractionOperation.js"

const {readOptions, doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { target } = readOptions(interaction)

    await doReply(interaction, target)
}

export default reply
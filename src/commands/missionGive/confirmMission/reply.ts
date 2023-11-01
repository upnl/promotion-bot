import operations from "./operations.js"
import { InteractionOperation } from "../../../interfaces/commands/InteractionOperation.js"
import assert from "assert"

const { readOptions, doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { target, isUniversal, category, index } = readOptions(interaction)

    await doReply(interaction, target, isUniversal, category, index)
}

export default reply
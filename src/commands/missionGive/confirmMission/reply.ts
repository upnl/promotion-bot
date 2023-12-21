import assert from "assert"
import { InteractionOperation } from "../../../interfaces/commands/InteractionOperation.js"
import { doReply, readOptions } from "./operations.js"

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { target, isUniversal, category, index } = readOptions(interaction)

    await doReply(interaction, target, isUniversal, category, index)
}

export default reply
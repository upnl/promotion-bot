import assert from "assert"
import { InteractionOperation } from "../../../interfaces/commands/InteractionOperation.js"
import { doReply, readOptions } from "./operations.js"

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { target, category, index } = readOptions(interaction)

    await doReply(interaction, target, category, index)
}

export default reply
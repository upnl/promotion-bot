import assert from "assert"
import { InteractionOperation } from "../../../interfaces/commands/InteractionOperation.js"
import { doReply, readOptions } from "./operations.js"

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { giver } = readOptions(interaction)

    await doReply(interaction, giver)
}

export default reply
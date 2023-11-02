import operations from "./operations.js"
import { InteractionOperation } from "../../../interfaces/commands/InteractionOperation.js"
import assert from "assert"
import { ConfigUpdateData } from "../../../interfaces/models/Config.js"

const { readOptions, doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { goalScore } = readOptions(interaction)

    const configUpdateData: ConfigUpdateData = {}
    if (goalScore !== null) configUpdateData.goalScore = goalScore

    await doReply(interaction, configUpdateData)
}

export default reply
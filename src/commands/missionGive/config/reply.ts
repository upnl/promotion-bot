import assert from "assert"
import { InteractionOperation } from "../../../interfaces/commands/InteractionOperation.js"
import { ConfigUpdateData } from "../../../interfaces/models/Config.js"
import operations from "./operations.js"

const { readOptions, doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { goalScore } = readOptions(interaction)

    const configUpdateData: ConfigUpdateData = {}
    if (goalScore !== null) configUpdateData.goalScore = goalScore

    await doReply(interaction, configUpdateData)
}

export default reply
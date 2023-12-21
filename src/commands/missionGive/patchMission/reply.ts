import assert from "assert"
import { InteractionOperation } from "../../../interfaces/commands/InteractionOperation.js"
import { MissionUpdateData } from "../../../interfaces/models/Mission.js"
import operations from "./operations.js"

const { readOptions, doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { target, index, category, content, note, score } = readOptions(interaction)

    const missionUpdateData: MissionUpdateData = {}
    if (content !== null) missionUpdateData.content = content
    if (note !== null) missionUpdateData.note = note
    if (score !== null) missionUpdateData.score = score

    await doReply(interaction, target, category, index, missionUpdateData)
}

export default reply
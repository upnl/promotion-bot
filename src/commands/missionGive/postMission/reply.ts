import assert from "assert"
import operations from "./operations.js"
import { InteractionOperation } from "../../../interfaces/commands/InteractionOperation.js"
import { Mission } from "../../../interfaces/models/Mission.js"

const { readOptions, doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { target, category, content, note, score } = readOptions(interaction)

    const mission: Mission = {
        category: category ?? (target !== interaction.user ? "개인 조건" : "공통 조건"),
        content,
        note: note ?? "",
        score: score ?? 1,
        giverId: interaction.user.id,
        targetId: target.id,
        completed: []
    }

    await doReply(interaction, target, mission)
}

export default reply
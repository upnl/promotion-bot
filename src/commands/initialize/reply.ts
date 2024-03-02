import assert from "assert";
import { InteractionOperation } from "../../interfaces/commands/InteractionOperation.js";
import { doReply, readOptions } from "./operations.js";

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())
    assert(interaction.guild !== null)

    const { chiefRole, regularRole, associateRole } = readOptions(interaction)

    await doReply(interaction, chiefRole, regularRole, associateRole)
}

export default reply
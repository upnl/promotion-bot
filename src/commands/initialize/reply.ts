import assert from "assert";
import { InteractionOperation } from "../../interfaces/commands/InteractionOperation.js";
import operations from "./operations.js";

const { readOptions, doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())
    assert(interaction.guild !== null)

    const { chiefRole, regularRole, associateRole } = readOptions(interaction)

    const realChiefRole = await interaction.guild.roles.fetch(chiefRole.id)
    const realRegularRole = await interaction.guild.roles.fetch(regularRole.id);
    const realAssociateRole = await interaction.guild.roles.fetch(associateRole.id);

    assert(realChiefRole !== null)
    assert(realRegularRole !== null)
    assert(realAssociateRole !== null)

    await doReply(interaction, realChiefRole, realRegularRole, realAssociateRole)
}

export default reply
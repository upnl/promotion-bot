import assert from "assert";
import operations from "./operations.js"
import { InteractionOperation } from "../../interfaces/commands/InteractionOperation.js";
import { Role } from "discord.js";

const { readOptions, doReply } = operations

const reply: InteractionOperation = async interaction => {
    assert(interaction.isChatInputCommand())

    const { year, quarter, regularRole, associateRole } = readOptions(interaction)

    const realRegularRole = await interaction.guild!.roles.fetch(regularRole.id);
    const realAssociateRole = await interaction.guild!.roles.fetch(associateRole.id);

    assert(realRegularRole !== null)
    assert(realAssociateRole !== null)

    await doReply(interaction, year, quarter, realRegularRole, realAssociateRole)
}

export default reply
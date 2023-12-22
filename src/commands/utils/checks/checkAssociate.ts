import assert from "assert";
import { ChatInputCommandInteraction } from "discord.js";
import { getAssociate } from "../../../db/actions/memberActions.js";
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js";
import { selectNotAssociateEmbed, selectNotAssociateOrSelfEmbed, selectUnknownAssociateEmbed } from "../errorEmbeds.js";
import { getRoleIds } from "../roleId/getRoleIds.js";
import { editOrReply } from "../editOrReply.js";

export const checkAssociate = async (
    interaction: ChatInputCommandInteraction,
    associateId: string,
    allowSelf: boolean = false,
    components?: ReplyComponents[]
): Promise<boolean> => {
    assert(interaction.guild !== null)

    const roleIds = await getRoleIds()

    const associateMember = interaction.guild.members.cache.get(associateId)

    assert(associateMember !== undefined)

    if (allowSelf && interaction.user.id === associateId)
        return true
    if (!associateMember.roles.cache.has(roleIds.associateRole)) {
        await editOrReply(interaction, { embeds: [allowSelf ? selectNotAssociateOrSelfEmbed : selectNotAssociateEmbed], components, ephemeral: true })
        return false
    }
    else if (await getAssociate(associateId) === undefined) {
        await editOrReply(interaction, { embeds: [selectUnknownAssociateEmbed], components, ephemeral: true })
        return false
    }

    return true
}
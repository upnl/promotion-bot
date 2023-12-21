import assert from "assert";
import { ChatInputCommandInteraction } from "discord.js";
import { getRegular } from "../../../db/actions/memberActions.js";
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js";
import { selectNotRegularEmbed, selectUnknownRegularEmbed } from "../errorEmbeds.js";
import { getRoleIds } from "../roleId/getRoleIds.js";
import { editOrReply } from "../editOrReply.js";

export const checkRegular = async (interaction: ChatInputCommandInteraction, regularId: string, components?: ReplyComponents[]): Promise<boolean> => {
    assert(interaction.guild !== null)

    const roleIds = await getRoleIds()

    const regularMember = await interaction.guild.members.fetch(regularId)

    assert(regularMember !== undefined)

    if (!regularMember.roles.cache.has(roleIds.regularRole)) {
        await editOrReply(interaction, { embeds: [selectNotRegularEmbed], components })
        return false
    }
    else if (await getRegular(regularId) === undefined) {
        await editOrReply(interaction, { embeds: [selectUnknownRegularEmbed], components })
        return false
    }

    return true
}

import { ChatInputCommandInteraction } from "discord.js";
import { getRoleIds } from "../roleId/getRoleIds.js";
import assert from "assert";
import { getRegular } from "../../../db/actions/memberActions.js";
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js";
import { selectNotRegularEmbed, selectUnknownRegularEmbed } from "../embeds/errorEmbed.js";

export const checkRegular = async (interaction: ChatInputCommandInteraction, regularId: string, components?: ReplyComponents[]): Promise<boolean> => {
    assert(interaction.guild !== null)

    const roleIds = await getRoleIds()

    const regularMember = interaction.guild.members.cache.get(regularId)

    assert(regularMember !== undefined)

    if (!regularMember.roles.cache.has(roleIds.regularRole)) {
        await interaction.editReply({ embeds: [selectNotRegularEmbed], components })
        return false
    }
    else if (await getRegular(regularId) === undefined) {
        await interaction.editReply({ embeds: [selectUnknownRegularEmbed], components })
        return false
    }

    return true
}

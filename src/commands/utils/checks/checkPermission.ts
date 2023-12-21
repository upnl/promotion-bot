import assert from "assert"
import { ChatInputCommandInteraction } from "discord.js"
import { getAssociate, getRegular } from "../../../db/actions/memberActions.js"
import { ReplyComponents } from "../../../interfaces/ReplyComponents.js"
import { CommandType } from "../../../interfaces/commands/CommandTypes.js"
import { notAssociateEmbed, notChiefEmbed, notOwnerEmbed, notRegularEmbed, unknownAssociateEmbed, unknownRegularEmbed } from "../errorEmbeds.js"
import { getRoleIds } from "../roleId/getRoleIds.js"
import { editOrReply } from "../editOrReply.js"

export const checkPermission = async (interaction: ChatInputCommandInteraction, type: CommandType, components?: ReplyComponents[]): Promise<boolean> => {
    assert(interaction.guild !== null)

    if (type === "공통")
        return true

    if (type === "서버장") {
        if (interaction.user.id !== interaction.guild.ownerId) {
            await editOrReply(interaction, { embeds: [notOwnerEmbed], components, ephemeral: true })
            return false
        }
        return true
    }

    const roleIds = await getRoleIds()
    const member = await interaction.guild.members.fetch(interaction.user.id)
    assert(member !== undefined)

    if (type === "넬장") {
        if (!member.roles.cache.has(roleIds.chiefRole)) {
            await editOrReply(interaction, { embeds: [notChiefEmbed], components, ephemeral: true })
            return false
        }
        return true
    }

    if (type === "정회원") {
        if (!member.roles.cache.has(roleIds.regularRole)) {
            await editOrReply(interaction, { embeds: [notRegularEmbed], components, ephemeral: true })
            return false
        }
        else if (await getRegular(interaction.user.id) === undefined) {
            await editOrReply(interaction, { embeds: [unknownRegularEmbed], components, ephemeral: true })
            return true
        }
        return true
    }

    if (type === "준회원") {
        if (!member.roles.cache.has(roleIds.associateRole)) {
            await editOrReply(interaction, { embeds: [notAssociateEmbed], components, ephemeral: true })
            return false
        }
        else if (await getAssociate(interaction.user.id) === undefined) {
            await editOrReply(interaction, { embeds: [unknownAssociateEmbed], components, ephemeral: true })
            return false
        }

        return true
    }

    return true
}
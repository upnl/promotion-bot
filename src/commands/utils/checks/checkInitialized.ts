import { ChatInputCommandInteraction } from "discord.js"
import { getRoleIds } from "../roleId/getRoleIds.js"
import { notInitializedEmbed } from "../errorEmbeds.js"
import { editOrReply } from "../editOrReply.js"

export const checkInitialized = async (interaction: ChatInputCommandInteraction): Promise<boolean> => {
    const roleIds = await getRoleIds()
    if (roleIds.chiefRole === "") {
        await editOrReply(interaction, { embeds: [notInitializedEmbed], ephemeral: true })
        return false
    }

    return true
}
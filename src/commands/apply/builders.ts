import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"
import { cancelColor, errorColor, normalColor, successColor } from "../utils/colors.js"

const applyEmbed = new EmbedBuilder().setTitle("승격신청을 합니까?").setColor(normalColor)
const successEmbed = new EmbedBuilder().setTitle("승격신청을 했습니다").setColor(successColor)
const canceledEmbed = new EmbedBuilder().setTitle("승격신청을 취소했습니다").setColor(cancelColor)
const duplicateEmbed = new EmbedBuilder().setTitle("이미 승격신청을 했습니다").setColor(errorColor)

const confirmButtonId = "mission-give-post-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("Confirm").setStyle(ButtonStyle.Success)
const cancelButtonId = "mission-give-post-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("Cancel").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    applyEmbed,
    successEmbed,
    canceledEmbed,
    duplicateEmbed,
    confirmButtonId,
    confirmButton,
    cancelButtonId,
    cancelButton,
    actionRow
}
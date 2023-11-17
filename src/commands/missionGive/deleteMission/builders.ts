import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"
import { errorColor, normalColor, successColor } from "../../utils/colors.js"

const missionNotFoundEmbed = new EmbedBuilder().setTitle("승격조건을 찾을 수 없습니다.").setColor(errorColor)

const replyEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 삭제합니까?").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 삭제했습니다").setColor(successColor)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("승격조건 삭제를 취소했습니다").setColor(errorColor)

const confirmButtonId = "delete-mission-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("확인").setStyle(ButtonStyle.Success)
const cancelButtonId = "delete-mission-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("취소").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    missionNotFoundEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,
    confirmButtonId,
    confirmButton,
    cancelButtonId,
    cancelButton,
    actionRow
}
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"
import { cancelColor, errorColor, normalColor, successColor } from "../../utils/colors.js"

const missionNotFoundEmbed = new EmbedBuilder().setTitle("승격조건을 찾을 수 없습니다.").setColor(errorColor)

const noChangeEmbed = new EmbedBuilder().setTitle("수정 사항이 없습니다").setColor(errorColor)
const replyEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 수정합니까?").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 수정했습니다").setColor(successColor)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("승격조건 수정을 취소했습니다").setColor(cancelColor)

const confirmButtonId = "patch-mission-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("확인").setStyle(ButtonStyle.Success)
const cancelButtonId = "patch-mission-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("취소").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    missionNotFoundEmbed,
    noChangeEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,
    confirmButtonId,
    confirmButton,
    cancelButtonId,
    cancelButton,
    actionRow
}
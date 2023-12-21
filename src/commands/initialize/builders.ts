import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"
import { cancelColor, normalColor, successColor } from "../utils/colors.js"

const initializeEmbedPrototype = new EmbedBuilder().setTitle("입력 사항을 확인해 주세요").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("시작").setColor(successColor)
const canceledEmbed = new EmbedBuilder().setTitle("취소했습니다").setColor(cancelColor)

const confirmButtonId = "initialize-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("Confirm").setStyle(ButtonStyle.Success)
const cancelButtonId = "initialize-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("Cancel").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    initializeEmbedPrototype,
    successEmbedPrototype,
    canceledEmbed,
    confirmButtonId,
    confirmButton,
    cancelButtonId,
    cancelButton,
    actionRow
}
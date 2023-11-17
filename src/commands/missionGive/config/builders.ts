import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"
import { cancelColor, normalColor, successColor } from "../../utils/colors.js"

const replyEmbedPrototype = new EmbedBuilder().setTitle("다음 수정사항을 적용합니까?").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("수정사항을 적용했습니다").setColor(successColor)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("수정사항 적용을 취소했습니다").setColor(cancelColor)

const confirmButtonId = "config-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("확인").setStyle(ButtonStyle.Success)
const cancelButtonId = "config-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("취소").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,

    confirmButtonId,
    confirmButton,
    cancelButtonId,
    cancelButton,
    actionRow
}
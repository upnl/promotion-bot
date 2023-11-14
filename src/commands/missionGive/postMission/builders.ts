import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"

const replyEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 추가합니까?")
const successEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 추가했습니다").setColor(Colors.Green)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("승격조건 추가를 취소했습니다").setColor(Colors.Red)

const confirmButtonId = "post-mission-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("확인").setStyle(ButtonStyle.Success)
const cancelButtonId = "post-mission-cancel"
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
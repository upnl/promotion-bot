import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"

const notRegularEmbed = new EmbedBuilder().setTitle("정회원이 아닙니다").setColor(Colors.Red)
const notAssociateEmbed = new EmbedBuilder().setTitle("대상으로는 승격신청을 한 준회원 및 자기 자신만 선택할 수 있습니다").setColor(Colors.Red)

const replyEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 추가합니까?")
const successEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 추가했습니다").setColor(Colors.Green)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("승격조건 추가를 취소했습니다").setColor(Colors.Red)

const confirmButtonId = "mission-give-post-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("확인").setStyle(ButtonStyle.Success)
const cancelButtonId = "mission-give-post-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("취소").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    notRegularEmbed,
    notAssociateEmbed,

    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,

    confirmButtonId,
    confirmButton,
    cancelButtonId,
    cancelButton,
    actionRow
}
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"

const notRegularEmbed = new EmbedBuilder().setTitle("정회원이 아닙니다").setColor(Colors.Red)

const replyEmbedPrototype = new EmbedBuilder().setTitle("다음 수정사항을 적용합니까?")
const successEmbedPrototype = new EmbedBuilder().setTitle("수정사항을 적용했습니다").setColor(Colors.Green)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("수정사항 적용을 취소했습니다").setColor(Colors.Red)

const confirmButtonId = "config-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("확인").setStyle(ButtonStyle.Success)
const cancelButtonId = "config-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("취소").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    notRegularEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,

    confirmButtonId,
    confirmButton,
    cancelButtonId,
    cancelButton,
    actionRow
}
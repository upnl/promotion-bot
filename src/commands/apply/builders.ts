import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"

const applyEmbed = new EmbedBuilder().setTitle("승격신청을 합니까?")
const successEmbed = new EmbedBuilder().setTitle("승격신청을 했습니다").setColor(Colors.Green)
const canceledEmbed = new EmbedBuilder().setTitle("승격조건 추가를 취소했습니다").setColor(Colors.Red)
const duplicateEmbed = new EmbedBuilder().setTitle("이미 승격신청을 했습니다").setColor(Colors.Red)

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
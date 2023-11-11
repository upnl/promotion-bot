import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"

const notLeaderEmbed = new EmbedBuilder().setTitle("넬장이 아닙니다").setColor(Colors.Red)

const invalidDataEmbed = new EmbedBuilder().setTitle("분기 정보는 연도와 분기 전부 입력 또는 입력하지 말아 주십시오")
const invalidQuarterEmbed = new EmbedBuilder().setTitle("분기는 1, 2, 3, 4분기 중에 하나로 입력해 주십시오")

const progressQuarterEmbedPrototype = new EmbedBuilder().setTitle("새 분기를 시작합니까?")
const successEmbedPrototype = new EmbedBuilder().setTitle("새 분기를 시작했습니다").setColor(Colors.Green)
const canceledEmbedPrototype = new EmbedBuilder().setTitle("새 분기 시작을 취소했습니다").setColor(Colors.Red)

const confirmButtonId = "progress-quarter-post-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("Confirm").setStyle(ButtonStyle.Success)
const cancelButtonId = "progress-quarter-post-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("Cancel").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    notLeaderEmbed,
    invalidDataEmbed,
    invalidQuarterEmbed,
    progressQuarterEmbedPrototype,
    successEmbedPrototype,
    canceledEmbedPrototype,
    confirmButtonId,
    confirmButton,
    cancelButtonId,
    cancelButton,
    actionRow
}
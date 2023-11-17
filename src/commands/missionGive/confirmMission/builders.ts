import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"
import { cancelColor, errorColor, successColor } from "../../utils/colors.js"

const missionNotFoundEmbed = new EmbedBuilder().setTitle("승격조건을 찾을 수 없습니다").setColor(errorColor)
const alreadyCompleteEmbed = new EmbedBuilder().setTitle("해당 준회원은 이 승격조건을 이미 달성했습니다").setColor(errorColor)

const replyEmbedPrototype = new EmbedBuilder()
const successEmbedPrototype = new EmbedBuilder().setTitle("승격조건 달성을 확인했습니다").setColor(successColor)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("승격조건 달성 확인을 취소했습니다").setColor(cancelColor)

const confirmButtonId = "confirm-mission-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("확인").setStyle(ButtonStyle.Success)
const cancelButtonId = "confirm-mission-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("취소").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    missionNotFoundEmbed,
    alreadyCompleteEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,

    confirmButtonId,
    confirmButton,
    cancelButtonId,
    cancelButton,
    actionRow
}
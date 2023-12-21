import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, MessageActionRowComponentBuilder } from "discord.js"
import { cancelColor, errorColor, normalColor, successColor } from "../utils/colors.js"

const regularRoleNotFoundEmbed = new EmbedBuilder().setTitle("정회원 롤을 찾을 수 없습니다").setColor(errorColor)
const invalidDataEmbed = new EmbedBuilder().setTitle("분기 정보는 연도와 분기 전부 입력 또는 입력하지 말아 주십시오").setColor(errorColor)
const invalidQuarterEmbed = new EmbedBuilder().setTitle("분기는 1, 2, 3, 4분기 중에 하나로 입력해 주십시오").setColor(errorColor)

const progressQuarterEmbedPrototype = new EmbedBuilder().setTitle("새 분기를 시작합니까?").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("새 분기를 시작했습니다").setColor(successColor)
const canceledEmbedPrototype = new EmbedBuilder().setTitle("새 분기 시작을 취소했습니다").setColor(cancelColor)

const confirmButtonId = "progress-quarter-confirm"
const confirmButton = new ButtonBuilder().setCustomId(confirmButtonId).setLabel("Confirm").setStyle(ButtonStyle.Success)
const cancelButtonId = "proOgress-quarter-cancel"
const cancelButton = new ButtonBuilder().setCustomId(cancelButtonId).setLabel("Cancel").setStyle(ButtonStyle.Danger)
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(confirmButton, cancelButton)

export default {
    regularRoleNotFoundEmbed,
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
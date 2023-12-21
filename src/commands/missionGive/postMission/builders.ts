import { EmbedBuilder } from "discord.js"
import { cancelColor, errorColor, normalColor, successColor } from "../../utils/colors.js"

const commandId = "post-mission"

const invalidScoreEmbed = new EmbedBuilder().setTitle("점수가 숫자가 아닙니다!").setColor(errorColor)
const replyEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 추가합니까?").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 추가했습니다").setColor(successColor)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("승격조건 추가를 취소했습니다").setColor(cancelColor)

export default {
    commandId,
    invalidScoreEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,
}
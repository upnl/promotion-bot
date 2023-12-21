import { EmbedBuilder } from "discord.js"
import { cancelColor, errorColor, normalColor, successColor } from "../../utils/colors.js"

const commandId = "patch-mission"

const missionNotFoundEmbed = new EmbedBuilder().setTitle("승격조건을 찾을 수 없습니다.").setColor(errorColor)

const invalidScoreEmbed = new EmbedBuilder().setTitle("점수가 숫자가 아닙니다!").setColor(errorColor)
const noChangeEmbed = new EmbedBuilder().setTitle("수정 사항이 없습니다").setColor(errorColor)
const replyEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 수정합니까?").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 수정했습니다").setColor(successColor)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("승격조건 수정을 취소했습니다").setColor(cancelColor)

export default {
    commandId,
    missionNotFoundEmbed,
    invalidScoreEmbed,
    noChangeEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype
}
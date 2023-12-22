import { EmbedBuilder } from "discord.js"
import { cancelColor, errorColor, normalColor, successColor } from "../../utils/colors.js"

const commandId = "patch-mission"

const missionNotFoundEmbed = new EmbedBuilder().setTitle("승격조건을 찾을 수 없습니다.").setColor(errorColor)

const invalidScoreEmbed = new EmbedBuilder()
    .setTitle("점수 또는 번호가 알맞지 않습니다")
    .setDescription("점수는 숫자만, 번호는 자연수만 입력 가능합니다")
    .setFooter({ text: "\u{1F62D} 팝업에서는 숫자만 입력받을 수 있는 입력창 넣는 방법이 없대요"})
    .setColor(errorColor)
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
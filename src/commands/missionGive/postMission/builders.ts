import { EmbedBuilder } from "discord.js"
import { cancelColor, errorColor, normalColor, successColor } from "../../utils/colors.js"

const commandId = "post-mission"

const invalidScoreEmbed = new EmbedBuilder()
    .setTitle("점수 또는 번호가 알맞지 않습니다")
    .setDescription("점수는 숫자만, 번호는 자연수만 입력 가능합니다")
    .setFooter({ text: "\u{1F62D} 팝업에서는 숫자만 입력받을 수 있는 입력창 넣는 방법이 없대요"})
    .setColor(errorColor)
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
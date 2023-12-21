import { EmbedBuilder } from "discord.js"
import { errorColor, normalColor, successColor } from "../../utils/colors.js"

const commandId = "delete-mission"

const missionNotFoundEmbed = new EmbedBuilder().setTitle("승격조건을 찾을 수 없습니다.").setColor(errorColor)

const replyEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 삭제합니까?").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("승격조건을 삭제했습니다").setColor(successColor)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("승격조건 삭제를 취소했습니다").setColor(errorColor)

export default {
    commandId,
    missionNotFoundEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype
}
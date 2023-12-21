import { EmbedBuilder } from "discord.js"
import { cancelColor, normalColor, successColor } from "../../utils/colors.js"

const commandId = "config"
const replyEmbedPrototype = new EmbedBuilder().setTitle("다음 수정사항을 적용합니까?").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("수정사항을 적용했습니다").setColor(successColor)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("수정사항 적용을 취소했습니다").setColor(cancelColor)

export default {
    commandId,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,
}
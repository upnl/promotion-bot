import { EmbedBuilder } from "discord.js"
import { cancelColor, normalColor, successColor } from "../utils/colors.js"

const commandId = "initialize"
const initializeEmbedPrototype = new EmbedBuilder().setTitle("입력 사항을 확인해 주세요").setColor(normalColor)
const successEmbedPrototype = new EmbedBuilder().setTitle("시작").setColor(successColor)
const canceledEmbed = new EmbedBuilder().setTitle("취소했습니다").setColor(cancelColor)

export default {
    commandId,
    initializeEmbedPrototype,
    successEmbedPrototype,
    canceledEmbed
}
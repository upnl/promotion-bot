import { EmbedBuilder } from "discord.js"
import { cancelColor, errorColor, normalColor, successColor } from "../utils/colors.js"

const commandId = "apply"
const applyEmbed = new EmbedBuilder().setTitle("승격신청을 합니까?").setColor(normalColor)
const successEmbed = new EmbedBuilder().setTitle("승격신청을 했습니다").setColor(successColor)
const canceledEmbed = new EmbedBuilder().setTitle("승격신청을 취소했습니다").setColor(cancelColor)
const duplicateEmbed = new EmbedBuilder().setTitle("이미 승격신청을 했습니다").setColor(errorColor)

export default {
    commandId,
    applyEmbed,
    successEmbed,
    canceledEmbed,
    duplicateEmbed
}
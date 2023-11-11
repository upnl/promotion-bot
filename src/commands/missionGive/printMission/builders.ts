import { Colors, EmbedBuilder } from "discord.js"

const notAssociateEmbed = new EmbedBuilder().setTitle("대상으로는 승격신청을 한 준회원 및 자기 자신만 선택할 수 있습니다").setColor(Colors.Red)
const notRegularEmbed = new EmbedBuilder().setTitle("정회원이 아닙니다").setColor(Colors.Red)

export default {
    notRegularEmbed,
    notAssociateEmbed,
}
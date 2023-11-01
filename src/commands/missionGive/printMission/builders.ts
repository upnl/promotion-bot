import { Colors, EmbedBuilder } from "discord.js"

const notAssociateEmbed = new EmbedBuilder().setTitle("해당 회원은 준회원이 아닙니다. 준회원 또는 자기 자신을 입력하세요").setColor(Colors.Red)
const notRegularEmbed = new EmbedBuilder().setTitle("정회원이 아닙니다").setColor(Colors.Red)

export default {
    notAssociateEmbed,
    notRegularEmbed,
}
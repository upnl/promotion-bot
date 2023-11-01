import { Colors, EmbedBuilder } from "discord.js";

const notAssociateEmbed = new EmbedBuilder().setTitle("준회원이 아니거나 승격 신청을 하지 않았습니다").setColor(Colors.Red)

export default {
    notAssociateEmbed
}
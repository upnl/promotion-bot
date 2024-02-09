import { EmbedBuilder } from "discord.js";
import { normalColor } from "../../utils/colors.js";

const noAssociateEmbed = new EmbedBuilder().setTitle("아직 승격신청을 한 준회원이 없습니다.").setColor(normalColor)

export default {
    noAssociateEmbed
}
import { ActionRowBuilder, Colors, EmbedBuilder, MessageActionRowComponentBuilder, UserSelectMenuBuilder } from "discord.js"

const notAssociateEmbed = new EmbedBuilder().setTitle("준회원이 아니거나 승격 신청을 하지 않았습니다").setColor(Colors.Red)
const noRegularEmbed = new EmbedBuilder().setTitle("정회원을 입력하세요")
const notRegularEmbed = new EmbedBuilder().setTitle("해당 회원은 정회원이 아닙니다").setColor(Colors.Red)

const REGULAR_MENU_ID = "regular-menu"
const regularMenu = new UserSelectMenuBuilder().setCustomId(REGULAR_MENU_ID).setPlaceholder("승격조건 목록을 확인하고 싶은 정회원")
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(regularMenu)

export default {
    notAssociateEmbed,
    noRegularEmbed,
    notRegularEmbed,
    REGULAR_MENU_ID,
    regularMenu,
    actionRow
}
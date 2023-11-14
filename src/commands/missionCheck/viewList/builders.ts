import { ActionRowBuilder, Colors, EmbedBuilder, MessageActionRowComponentBuilder, UserSelectMenuBuilder } from "discord.js"

const noRegularEmbed = new EmbedBuilder().setTitle("정회원을 입력하세요")

const REGULAR_MENU_ID = "regular-menu"
const regularMenu = new UserSelectMenuBuilder().setCustomId(REGULAR_MENU_ID).setPlaceholder("승격조건 목록을 확인하고 싶은 정회원")
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(regularMenu)

export default {
    noRegularEmbed,
    REGULAR_MENU_ID,
    regularMenu,
    actionRow
}
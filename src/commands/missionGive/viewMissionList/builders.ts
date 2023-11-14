import { ActionRowBuilder, Colors, EmbedBuilder, MessageActionRowComponentBuilder, UserSelectMenuBuilder } from "discord.js"

const noAssociateEmbed = new EmbedBuilder().setTitle("준회원을 입력하세요")

const ASSOCIATE_MENU_ID = "associate-menu"
const associateMenu = new UserSelectMenuBuilder().setCustomId(ASSOCIATE_MENU_ID).setPlaceholder("승격조건 목록을 확인하고 싶은 준회원")
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(associateMenu)

export default {
    noAssociateEmbed,
    ASSOCIATE_MENU_ID,
    associateMenu,
    actionRow
}
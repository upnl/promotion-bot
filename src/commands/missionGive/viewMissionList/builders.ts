import { ActionRowBuilder, Colors, EmbedBuilder, MessageActionRowComponentBuilder, UserSelectMenuBuilder } from "discord.js"

const noAssociateEmbed = new EmbedBuilder().setTitle("준회원을 입력하세요")
const notAssociateEmbed = new EmbedBuilder().setTitle("대상으로는 승격신청을 한 준회원 및 자기 자신만 선택할 수 있습니다").setColor(Colors.Red)
const notRegularEmbed = new EmbedBuilder().setTitle("정회원이 아닙니다").setColor(Colors.Red)

const ASSOCIATE_MENU_ID = "associate-menu"
const associateMenu = new UserSelectMenuBuilder().setCustomId(ASSOCIATE_MENU_ID).setPlaceholder("승격조건 목록을 확인하고 싶은 준회원")
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(associateMenu)

export default {
    noAssociateEmbed,
    notAssociateEmbed,
    notRegularEmbed,
    ASSOCIATE_MENU_ID,
    associateMenu,
    actionRow
}
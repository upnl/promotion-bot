import { ActionRowBuilder, EmbedBuilder, MessageActionRowComponentBuilder, UserSelectMenuBuilder } from "discord.js"
import { normalColor } from "../../utils/colors.js"

const noAssociateEmbed = new EmbedBuilder().setTitle("준회원을 입력하세요").setColor(normalColor)
const viewMissionListEmbedPrototype = new EmbedBuilder().setColor(normalColor)

const ASSOCIATE_MENU_ID = "associate-menu"
const associateMenu = new UserSelectMenuBuilder().setCustomId(ASSOCIATE_MENU_ID).setPlaceholder("승격조건 목록을 확인하고 싶은 준회원")
const actionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(associateMenu)

export default {
    noAssociateEmbed,
    viewMissionListEmbedPrototype,
    ASSOCIATE_MENU_ID,
    associateMenu,
    actionRow
}
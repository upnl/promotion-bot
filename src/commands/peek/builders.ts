import {
  ActionRowBuilder,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  UserSelectMenuBuilder,
} from "discord.js";
import { normalColor } from "../utils/colors.js";

const noUserEmbed = new EmbedBuilder()
  .setTitle("정회원 또는 준회원을 입력하세요")
  .setColor(normalColor);
const viewListEmbedPrototype = new EmbedBuilder().setColor(normalColor);

const noAssociateEmbed = new EmbedBuilder()
  .setTitle("아직 승격신청을 한 준회원이 없습니다.")
  .setColor(normalColor);

const REGULAR_MENU_ID = "regular-menu";
const regularMenu = new UserSelectMenuBuilder()
  .setCustomId(REGULAR_MENU_ID)
  .setPlaceholder("승격조건 목록을 확인하고 싶은 정회원");
const ASSOCITE_MENU_ID = "associate-menu";
const associateMenu = new UserSelectMenuBuilder()
  .setCustomId(ASSOCITE_MENU_ID)
  .setPlaceholder("승격조건 목록을 확인하고 싶은 준회원");

const actionRow1 =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    regularMenu
  );
const actionRow2 = 
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      associateMenu
    );

export default {
  noUserEmbed,
  noAssociateEmbed,
  viewListEmbedPrototype,
  REGULAR_MENU_ID,
  regularMenu,
  ASSOCITE_MENU_ID,
  associateMenu,
  actionRow1,
  actionRow2
};

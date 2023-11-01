import { Colors, EmbedBuilder } from "discord.js"

const notRegularEmbed = new EmbedBuilder().setTitle("정회원이 아닙니다.").setColor(Colors.Red)
const notAssociateEmbed = new EmbedBuilder().setTitle("대상으로는 승격신청을 한 준회원만 선택할 수 있습니다.").setColor(Colors.Red)
const missionNotFoundEmbed = new EmbedBuilder().setTitle("승격조건을 찾을 수 없습니다.").setColor(Colors.Red)

const replyEmbedPrototype = new EmbedBuilder().setTitle("승격조건 달성을 확인합니까?")
const successEmbedPrototype = new EmbedBuilder().setTitle("승격조건 달성을 확인했습니다").setColor(Colors.Green)
const cancelEmbedPrototype = new EmbedBuilder().setTitle("승격조건 달성 확인을 취소했습니다").setColor(Colors.Red)
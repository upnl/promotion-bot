import { Colors, EmbedBuilder } from "discord.js";

export const errorEmbed = new EmbedBuilder().setTitle("DB 접속 오류").setColor(Colors.Red)

export const testEmbed = new EmbedBuilder().setTitle("테스트 중입니다").setColor(Colors.Red)

export const notInitializedEmbed = new EmbedBuilder().setTitle("아직 초기 설정이 완료되지 않았습니다").setColor(Colors.Red)

export const notInGuildEmbed = new EmbedBuilder().setTitle("유피넬 서버 안에서 사용해 주세요").setColor(Colors.Red)

export const notOwnerEmbed = new EmbedBuilder().setTitle("서버장이 아닙니다").setColor(Colors.Red)
export const notChiefEmbed = new EmbedBuilder().setTitle("넬장이 아닙니다").setColor(Colors.Red)
export const notRegularEmbed = new EmbedBuilder().setTitle("정회원이 아닙니다").setColor(Colors.Red)
export const unknownRegularEmbed = new EmbedBuilder().setTitle("알려지지 않은 정회원입니다").setColor(Colors.Red)
export const notAssociateEmbed = new EmbedBuilder().setTitle("준회원이 아닙니다").setColor(Colors.Red)
export const unknownAssociateEmbed = new EmbedBuilder().setTitle("먼저 승격신청을 해 주세요 ").setColor(Colors.Red)

export const selectNotAssociateEmbed = new EmbedBuilder().setTitle("준회원을 선택해 주세요").setColor(Colors.Red)
export const selectNotAssociateOrSelfEmbed = new EmbedBuilder().setTitle("준회원 또는 자기 자신을 선택해 주세요").setColor(Colors.Red)
export const selectUnknownAssociateEmbed = new EmbedBuilder().setTitle("해당 준회원은 아직 승격신청을 하지 않았습니다").setColor(Colors.Red)

export const selectNotRegularEmbed = new EmbedBuilder().setTitle("정회원을 선택해 주세요").setColor(Colors.Red)
export const selectUnknownRegularEmbed = new EmbedBuilder().setTitle("해당 정회원은 알려지지 않은 정회원입니다").setColor(Colors.Red)
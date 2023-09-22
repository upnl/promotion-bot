import assert from "assert"
import { ActionRowBuilder, EmbedBuilder, Interaction, MessageActionRowComponentBuilder, UserSelectMenuBuilder, } from "discord.js"
import { InteractionOperation } from "../../interfaces/commands/InteractionOperation.js"

const createEmbed = () => new EmbedBuilder()
    .setTitle("아무개의 승격 조건 : 박지호")
    .addFields([
        { name: "달성 현황", value: ":large_blue_diamond:" + ":green_square:".repeat(6) + ":black_large_square:".repeat(2) + ":large_blue_diamond:" + " (1.5점 / 2점)", inline: false },
        { name: "공통 조건", value: "1. :white_square_button: 뭔가를 하세요 [1점]\n2. :white_check_mark: 쉬운 뭔가를 하세요 [0.5점]\n  - 쉬운 뭔가라 0.5점만 드립니다\n4. :white_square_button: 어려운 뭔가를 하세요 [2점]\n  - 어려운 뭔가라 2점을 드립니다", inline: false },
        { name: "개인 조건", value: "1. :white_check_mark: 특별한 뭔가를 하세요 [1점]", inline: false },
    ])
    .setTimestamp()
    .setFooter({ text: 'Prommy by coinmoles' })

const createMenu = () => new UserSelectMenuBuilder()
    .setCustomId("gottenMissionGetMenu")
    .setPlaceholder("승격조건 목록을 확인하고 싶은 정회원")

const createActionRow = () => new ActionRowBuilder<MessageActionRowComponentBuilder>()
    .addComponents(createMenu())

export const gottenMissionGetReply = async (interaction: Interaction) => {
    assert(interaction.isRepliable())

    await interaction.reply({ embeds: [createEmbed()], components: [createActionRow()] })
}

export const gottenMissionGetMenu: [string, InteractionOperation] = [
    createMenu().data.custom_id!,
    async (interaction: Interaction) => {
        assert(interaction.isUserSelectMenu())

        interaction.deferUpdate()
        await interaction.message.edit({ content: interaction.values.join(" "), embeds: [createEmbed()], components: [createActionRow()] })
    }
]
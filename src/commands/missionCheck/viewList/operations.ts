import { ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User, UserSelectMenuInteraction } from "discord.js"
import { getMissionAll } from "../../../db/actions/missionActions.js"
import { getMissionProgress } from "../../../db/actions/missionProgressActions.js"
import { checkRegular } from "../../utils/checks/checkRegular.js"
import { createMissionMapString } from "../../utils/createString/createMissionString.js"
import { createProgressString } from "../../utils/createString/createProgresString.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { getQuarterDataFooter } from "../../utils/quarterData/getQuarterData.js"
import builders from "./builders.js"

const {
    noRegularEmbed,
    viewListEmbedPrototype,
    REGULAR_MENU_ID,
    actionRow
} = builders

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    giver: interaction.options.getUser("정회원")
})

const doMenu = async (interaction: ChatInputCommandInteraction, menuInteraction: UserSelectMenuInteraction) => {
    if (menuInteraction.customId === REGULAR_MENU_ID) {
        await menuInteraction.deferUpdate()

        const newGiver = interaction.client.users.cache.get(menuInteraction.values[0])!
        await doReply(interaction, newGiver, true)
    }
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>
) => {
    const collector = reply.createMessageComponentCollector({
        max: 10,
        filter: i => i.user === interaction.user,
        componentType: ComponentType.UserSelect
    })
    collector.on("collect", buttonInteraction => doMenu(interaction, buttonInteraction))
}

export const doReply = async (interaction: ChatInputCommandInteraction, giver: User | null, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply({ephemeral: true})

    if (giver === null) {
        const reply = await interaction.editReply({ embeds: [noRegularEmbed.setFooter(await getQuarterDataFooter())], components: [actionRow] })
        if (!isEditing)
            addCollector(interaction, reply)
        return
    }
    else if (!await checkRegular(interaction, giver.id, [actionRow])) {
        if (!isEditing)
            addCollector(interaction, await interaction.fetchReply())
        return
    }

    const progress = await getMissionProgress(giver.id, interaction.user.id)
    const missionUniversal = await getMissionAll(giver.id, giver.id)
    const missionSpecific = await getMissionAll(giver.id, interaction.user.id)
    if (missionUniversal === undefined || missionSpecific === undefined || progress === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }

    const reply = await interaction.editReply({ 
        embeds: [EmbedBuilder.from(viewListEmbedPrototype)
            .setTitle(`${interaction.user.displayName}의 승격 조건 : ${giver.displayName}`)
            .addFields({ name: "달성 현황", value: createProgressString(progress.currentScore, progress.goalScore), inline: false })
            .addFields({ name: "공통 조건", value: createMissionMapString(missionUniversal, interaction.user.id), inline: false })
            .addFields({ name: "개인 조건", value: createMissionMapString(missionSpecific, interaction.user.id), inline: false })
            .setFooter(await getQuarterDataFooter())], 
        components: [actionRow] 
    })

    if (!isEditing)
        addCollector(interaction, reply)
}
import { getAssociate, getRegular } from "../../../db/actions/memberActions.js"
import { getMissionAll } from "../../../db/actions/missionActions.js"
import { getMissionProgress } from "../../../db/actions/missionProgressActions.js"
import { createMissionMapString, createProgressString } from "../../utils/createString/createMissionString.js"
import { errorEmbed } from "../../utils/embeds/errorEmbed.js"
import builders from "./builders.js"
import { ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User, UserSelectMenuInteraction } from "discord.js"

const {
    notAssociateEmbed,
    noRegularEmbed,
    notRegularEmbed,
    REGULAR_MENU_ID,
    actionRow
} = builders

const readOptions = (interaction: ChatInputCommandInteraction) => ({
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
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    giver: User | null
) => {
    const collector = reply.createMessageComponentCollector({
        max: 10,
        filter: i => i.user === interaction.user,
        componentType: ComponentType.UserSelect
    })
    collector.on("collect", buttonInteraction => doMenu(interaction, buttonInteraction))
}

const doReply = async (interaction: ChatInputCommandInteraction, giver: User | null, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply()

    if (await getAssociate(interaction.user.id) === undefined) {
        await interaction.editReply({ embeds: [notAssociateEmbed] })
        return
    }
    if (giver === null) {
        const reply = await interaction.editReply({ embeds: [noRegularEmbed], components: [actionRow] })
        if (!isEditing)
            addCollector(interaction, reply, giver)
        return
    }
    else if (await getRegular(giver.id) === undefined) {
        const reply = await interaction.editReply({ embeds: [notRegularEmbed], components: [actionRow] })
        if (!isEditing)
            addCollector(interaction, reply, giver)
        return
    }

    const progress = await getMissionProgress(giver.id, interaction.user.id)
    const missions = await getMissionAll(giver.id, interaction.user.id)
    if (missions === undefined || progress === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }
    const [missionUniversal, missionSpecific] = missions

    const replyEmbed = new EmbedBuilder()
        .setTitle(`${interaction.user.displayName}의 승격 조건 : ${giver.displayName}`)
        .addFields({ name: "달성 현황", value: createProgressString(progress.currentScore, progress.goalScore), inline: false })
        .addFields({ name: "공통 조건", value: createMissionMapString(missionUniversal, interaction.user.id), inline: false })
        .addFields({ name: "개인 조건", value: createMissionMapString(missionSpecific, interaction.user.id), inline: false })

    const reply = await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] })

    if (!isEditing)
        addCollector(interaction, reply, giver)
}

export default {
    readOptions,
    doReply
}
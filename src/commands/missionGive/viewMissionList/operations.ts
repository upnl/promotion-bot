import { ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User, UserSelectMenuInteraction } from "discord.js"
import { getMissionAll } from "../../../db/actions/missionActions.js"
import { getMissionProgress } from "../../../db/actions/missionProgressActions.js"
import { checkAssociate } from "../../utils/checks/checkAssociate.js"
import { createMissionMapString, createProgressString } from "../../utils/createString/createMissionString.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { getQuarterDataFooter } from "../../utils/quarterData/getQuarterData.js"
import builders from "./builders.js"

const {
    noAssociateEmbed,
    viewMissionListEmbedPrototype,
    ASSOCIATE_MENU_ID,
    actionRow
} = builders

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("준회원")
})

const doMenu = async (interaction: ChatInputCommandInteraction, menuInteraction: UserSelectMenuInteraction) => {
    if (menuInteraction.customId === ASSOCIATE_MENU_ID) {
        await menuInteraction.deferUpdate()

        const newTarget = interaction.client.users.cache.get(menuInteraction.values[0])!
        await doReply(interaction, newTarget, true)
    }
}

const addCollector = (interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>) => {
    const collector = reply.createMessageComponentCollector({
        max: 10,
        filter: i => i.user === interaction.user,
        componentType: ComponentType.UserSelect
    })
    collector.on("collect", buttonInteraction => doMenu(interaction, buttonInteraction))
}

export const doReply = async (interaction: ChatInputCommandInteraction, target: User | null, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply({ ephemeral: true })

    if (target === null) {
        const reply = await interaction.editReply({ embeds: [noAssociateEmbed.setFooter(await getQuarterDataFooter())], components: [actionRow] })
        if (!isEditing)
            addCollector(interaction, reply)
        return
    }

    let replyEmbed: EmbedBuilder;
    if (target.id === interaction.user.id) {
        const missions = await getMissionAll(interaction.user.id, target.id)

        if (missions === undefined) {
            await interaction.editReply({ embeds: [errorEmbed] })
            return;
        }

        const [missionUniversal, _] = missions

        replyEmbed = new EmbedBuilder(viewMissionListEmbedPrototype.toJSON())
            .setTitle(`공통 승격 조건: ${interaction.user.displayName}`)
            .addFields({ name: "공통 조건", value: createMissionMapString(missionUniversal, interaction.user.id), inline: false })
    }
    else {
        if (!await checkAssociate(interaction, target.id, true, [actionRow])) {
            if (!isEditing)
                addCollector(interaction, await interaction.fetchReply())
            return
        }

        const progress = await getMissionProgress(interaction.user.id, target.id)
        const missions = await getMissionAll(interaction.user.id, target.id)
        if (missions === undefined || progress === undefined) {
            await interaction.editReply({ embeds: [errorEmbed] })
            return
        }
        const [missionUniversal, missionSpecific] = missions

        replyEmbed = new EmbedBuilder(viewMissionListEmbedPrototype.toJSON())
            .setTitle(`${target.displayName}의 승격 조건 : ${interaction.user.displayName}`)
            .addFields({ name: "달성 현황", value: createProgressString(progress.currentScore, progress.goalScore), inline: false })
            .addFields({ name: "공통 조건", value: createMissionMapString(missionUniversal, target.id), inline: false })
            .addFields({ name: "개인 조건", value: createMissionMapString(missionSpecific, target.id), inline: false })
    }

    const reply = await interaction.editReply({ embeds: [replyEmbed.setFooter(await getQuarterDataFooter())], components: [actionRow] })

    if (!isEditing)
        addCollector(interaction, reply)
}
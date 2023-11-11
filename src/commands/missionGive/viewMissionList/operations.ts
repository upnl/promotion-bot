import { getAssociate, getRegular } from "../../../db/actions/memberActions.js"
import { getMissionAll } from "../../../db/actions/missionActions.js"
import { getMissionProgress } from "../../../db/actions/missionProgressActions.js"
import { createMissionMapString, createProgressString } from "../../utils/createString/createMissionString.js"
import { errorEmbed } from "../../utils/embeds/errorEmbed.js"
import builders from "./builders.js"
import { ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User, UserSelectMenuInteraction } from "discord.js"

const {
    noAssociateEmbed,
    notAssociateEmbed,
    notRegularEmbed,
    ASSOCIATE_MENU_ID,
    actionRow
} = builders

const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("준회원")
})

const doMenu = async (interaction: ChatInputCommandInteraction, menuInteraction: UserSelectMenuInteraction) => {
    if (menuInteraction.customId === ASSOCIATE_MENU_ID) {
        await menuInteraction.deferUpdate()

        const newTarget = interaction.client.users.cache.get(menuInteraction.values[0])!
        await doReply(interaction, newTarget, true)
    }
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    target: User | null
) => {
    const collector = reply.createMessageComponentCollector({
        max: 10,
        filter: i => i.user === interaction.user,
        componentType: ComponentType.UserSelect
    })
    collector.on("collect", buttonInteraction => doMenu(interaction, buttonInteraction))
}

const doReply = async (interaction: ChatInputCommandInteraction, target: User | null, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply()

    if (await getRegular(interaction.user.id) === undefined) {
        await interaction.editReply({ embeds: [notRegularEmbed] })
        return
    }
    if (target === null) {
        const reply = await interaction.editReply({ embeds: [noAssociateEmbed], components: [actionRow] })
        if (!isEditing)
            addCollector(interaction, reply, target)
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

        replyEmbed = new EmbedBuilder()
            .setTitle(`공통 승격 조건: ${interaction.user.displayName}`)
            .addFields({ name: "공통 조건", value: createMissionMapString(missionUniversal, interaction.user.id), inline: false })
    }
    else {
        if (await getAssociate(target.id) === undefined) {
            const reply = await interaction.editReply({ embeds: [notAssociateEmbed], components: [actionRow] })
            if (!isEditing)
                addCollector(interaction, reply, target)
            return
        }

        const progress = await getMissionProgress(interaction.user.id, target.id)
        const missions = await getMissionAll(interaction.user.id, target.id)
        if (missions === undefined || progress === undefined) {
            await interaction.editReply({ embeds: [errorEmbed] })
            return
        }
        const [missionUniversal, missionSpecific] = missions

        console.log(missionSpecific.size);

        replyEmbed = new EmbedBuilder()
            .setTitle(`${target.displayName}의 승격 조건 : ${interaction.user.displayName}`)
            .addFields({ name: "달성 현황", value: createProgressString(progress.currentScore, progress.goalScore), inline: false })
            .addFields({ name: "공통 조건", value: createMissionMapString(missionUniversal, target.id), inline: false })
            .addFields({ name: "개인 조건", value: createMissionMapString(missionSpecific, target.id), inline: false })
    }

    const reply = await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] })

    if (!isEditing)
        addCollector(interaction, reply, target)
}

export default {
    readOptions,
    doReply
}
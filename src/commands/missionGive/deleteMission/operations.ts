﻿import builders from "./builders.js"
import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User } from "discord.js"
import { getAssociate, getRegular } from "../../../db/actions/memberActions.js"
import { deleteMission, getMission } from "../../../db/actions/missionActions.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { createMissionPreviewString, createMissionPreviewTitle } from "../../utils/createString/createMissionPreviewString.js"
import { checkRegular } from "../../utils/checks/checkRegular.js"
import { checkAssociate } from "../../utils/checks/checkAssociate.js"
import { getQuarterDataFooter } from "../../utils/quarterData/getQuarterData.js"

const {
    missionNotFoundEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,
    confirmButtonId,
    cancelButtonId,
    actionRow
} = builders

const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("대상", true),
    category: interaction.options.getString("카테고리", true),
    index: interaction.options.getNumber("번호", true) - 1
})

const doConfirm = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    target: User, category: string, index: number,
    mission: Mission
) => {
    await buttonInteraction.deferReply({ephemeral: true})

    const success = await deleteMission(interaction.user.id, target.id, category, index)

    if (success) {
        const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

        await buttonInteraction.deleteReply()
        await interaction.editReply({ embeds: [successEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }
    else
        await buttonInteraction.editReply({ embeds: [errorEmbed] })
}

const doCancel = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    target: User, category: string, index: number,
    mission: Mission
) => {
    await buttonInteraction.deferUpdate()

    const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
        .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

    await interaction.editReply({ embeds: [cancelEmbed.setFooter(await getQuarterDataFooter())], components: [] })
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    target: User, category: string, index: number,
    mission: Mission
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })

    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, target, category, index, mission)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, target, category, index, mission)
    })
}

const doReply = async (interaction: ChatInputCommandInteraction, target: User, category: string, index: number, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply({ephemeral: true})

    if (!await checkAssociate(interaction, target.id, true))
        return

    const mission = await getMission(interaction.user.id, target.id, category, index)

    if (mission === null) {
        await interaction.editReply({ embeds: [missionNotFoundEmbed] })
        return
    }
    if (mission === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }

    const replyEmbed = new EmbedBuilder(replyEmbedPrototype.toJSON())
        .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })
    const reply = await interaction.editReply({ embeds: [replyEmbed.setFooter(await getQuarterDataFooter())], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply, target, category, index, mission)
}

export default {
    readOptions,
    doReply
}
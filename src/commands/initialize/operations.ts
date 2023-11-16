﻿import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, Role } from "discord.js"
import builders from "./builders.js"
import { errorEmbed } from "../utils/embeds/errorEmbed.js"
import { getQuarterData, getQuarterDataString } from "../utils/quarterData/getQuarterData.js"
import { QuarterData } from "../../interfaces/models/QuarterData.js"
import { nextQuarter } from "../utils/quarterData/nextQuarter.js"
import { createQuarterDataString } from "../utils/createString/createQuarterDataString.js"
import { makeBold } from "../utils/createString/markdown.js"
import assert from "assert"
import { setQuarterData } from "../utils/quarterData/setQuarterData.js"
import { setRoleIds } from "../utils/roleId/setRoleIds.js"
import { RoleIds } from "../../interfaces/models/RoleIds.js"
import { firebaseDb } from "../../db/firebase.js"
import { QUARTER, REGULAR } from "../../db/collectionNames.js"
import { regularConverter } from "../../db/converters/regularConverter.js"

const {
    initializeEmbedPrototype,
    successEmbedPrototype,
    canceledEmbed,
    confirmButtonId,
    cancelButtonId,
    actionRow
} = builders

const readOptions = (interaction: ChatInputCommandInteraction) => ({
    chiefRole: interaction.options.getRole("넬장", true),
    regularRole: interaction.options.getRole("정회원", true),
    associateRole: interaction.options.getRole("준회원", true)
})

const doConfirm = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    chiefRole: Role, regularRole: Role, associateRole: Role,
) => {
    await buttonInteraction.deferReply()

    try {
        await setRoleIds({ chiefRole: chiefRole.id, regularRole: regularRole.id, associateRole: associateRole.id })

        const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
            .addFields({ name: "넬장", value: chiefRole.toString(), inline: true })
            .addFields({ name: "정회원", value: regularRole.toString(), inline: true })
            .addFields({ name: "준회원", value: associateRole.toString(), inline: true })

        await buttonInteraction.deleteReply()
        await buttonInteraction.message.edit({ embeds: [successEmbed], components: [] })
    }
    catch (e) {
        await buttonInteraction.editReply({ embeds: [errorEmbed] })
    }
}

const doCancel = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    chiefRole: Role, regularRole: Role, associateRole: Role,
) => {
    await buttonInteraction.deferUpdate()

    await buttonInteraction.message.edit({ embeds: [canceledEmbed], components: [] })
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    chiefRole: Role, regularRole: Role, associateRole: Role,
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })
    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, chiefRole, regularRole, associateRole)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, chiefRole, regularRole, associateRole)
    })
}

const doReply = async (
    interaction: ChatInputCommandInteraction,
    chiefRole: Role, regularRole: Role, associateRole: Role,
    isEditing: boolean = false
) => {
    await interaction.deferReply()

    const replyEmbed = new EmbedBuilder(initializeEmbedPrototype.toJSON())
        .addFields({ name: "넬장", value: chiefRole.toString(), inline: true })
        .addFields({ name: "정회원", value: regularRole.toString(), inline: true })
        .addFields({ name: "준회원", value: associateRole.toString(), inline: true })

    const reply = await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply, chiefRole, regularRole, associateRole)
}

export default { readOptions, doReply }
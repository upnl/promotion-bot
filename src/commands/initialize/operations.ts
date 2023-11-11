import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message } from "discord.js"
import builders from "./builders.js"
import { errorEmbed } from "../utils/embeds/errorEmbed.js"
import { getQuarterData } from "../utils/quarterData/getQuarterData.js"
import { QuarterData } from "../../interfaces/models/QuarterData.js"
import { nextQuarter } from "../utils/quarterData/nextQuarter.js"
import { createQuarterDataString } from "../utils/createString/createQuarterDataString.js"
import { makeBold } from "../utils/createString/markdown.js"

const {
    notLeaderEmbed,
    invalidDataEmbed,
    invalidQuarterEmbed,
    progressQuarterEmbedPrototype,
    successEmbedPrototype,
    canceledEmbedPrototype,
    confirmButtonId,
    cancelButtonId,
    actionRow
} = builders

const readOptions = (interaction: ChatInputCommandInteraction) => ({
    year: interaction.options.getNumber("연도"),
    quarter: interaction.options.getNumber("분기")
})

const doConfirm = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    quarterNew: QuarterData
) => {
    await buttonInteraction.deferReply()

    try {
        const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
            .setDescription(makeBold(createQuarterDataString(quarterNew)))

        await buttonInteraction.deleteReply()
        await buttonInteraction.message.edit({ embeds: [successEmbed], components: [] })
    }
    catch (e) {
        await buttonInteraction.editReply({ embeds: [errorEmbed] })
    }
}

const doCancel = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    quarterNew: QuarterData
) => {
    await buttonInteraction.deferUpdate()

    const cancelEmbed = new EmbedBuilder(canceledEmbedPrototype.toJSON())
        .setDescription(makeBold(createQuarterDataString(quarterNew)))

    await buttonInteraction.message.edit({ embeds: [cancelEmbed], components: [] })
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    quarterNew: QuarterData
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })
    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, quarterNew)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, quarterNew)
    })
}

const doReply = async (
    interaction: ChatInputCommandInteraction,
    year: number | null, quarter: number | null,
    isEditing: boolean = false
) => {
    await interaction.deferReply()

    let quarterNew: QuarterData

    if (year === null && quarter === null)
        quarterNew = nextQuarter(getQuarterData())
    else if (year === null || quarter === null) {
        await interaction.editReply({ embeds: [invalidDataEmbed] })
        return
    }
    else {
        if (quarter !== 1 && quarter !== 2 && quarter !== 3 && quarter !== 4) {
            await interaction.editReply({ embeds: [invalidQuarterEmbed] })
            return
        }

        quarterNew = { year, quarter }
    }

    const replyEmbed = new EmbedBuilder(progressQuarterEmbedPrototype.toJSON())
        .setDescription(makeBold(createQuarterDataString(quarterNew)))

    const reply = await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply, quarterNew)
}

export default { readOptions, doReply }
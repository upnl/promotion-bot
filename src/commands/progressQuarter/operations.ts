import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, Role } from "discord.js"
import builders from "./builders.js"
import { errorEmbed } from "../utils/errorEmbeds.js"
import { getQuarterData, getQuarterDataFooter, getQuarterDataString } from "../utils/quarterData/getQuarterData.js"
import { QuarterData } from "../../interfaces/models/QuarterData.js"
import { nextQuarter } from "../utils/quarterData/nextQuarter.js"
import { createQuarterDataString } from "../utils/createString/createQuarterDataString.js"
import { makeBold } from "../utils/createString/markdown.js"
import assert from "assert"
import { setQuarterData } from "../utils/quarterData/setQuarterData.js"
import { firebaseDb } from "../../db/firebase.js"
import { QUARTER, REGULAR } from "../../db/collectionNames.js"
import { regularConverter } from "../../db/converters/regularConverter.js"
import { getRoleIds } from "../utils/roleId/getRoleIds.js"

const {
    regularRoleNotFoundEmbed,
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
    year: interaction.options.getInteger("연도"),
    quarter: interaction.options.getInteger("분기")
})

const doConfirm = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    quarterNew: QuarterData, regularRole: Role
) => {
    await buttonInteraction.deferReply({ephemeral: true})

    try {
        for (const [regularId, _] of regularRole.members) {
            await firebaseDb
                .collection(QUARTER).doc(await getQuarterDataString(quarterNew))
                .collection(REGULAR).doc(regularId)
                .withConverter(regularConverter)
                .set({ config: { goalScore: 10 } })
        }

        await setQuarterData(quarterNew)

        const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
            .setDescription(makeBold(createQuarterDataString(quarterNew)))

        await buttonInteraction.deleteReply()
        await interaction.editReply({ embeds: [successEmbed], components: [] })
    }
    catch (e) {
        await buttonInteraction.editReply({ embeds: [errorEmbed] })
    }
}

const doCancel = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    quarterNew: QuarterData, regularRole: Role
) => {
    await buttonInteraction.deferUpdate()

    const cancelEmbed = new EmbedBuilder(canceledEmbedPrototype.toJSON())
        .setDescription(makeBold(createQuarterDataString(quarterNew)))

    await interaction.editReply({ embeds: [cancelEmbed], components: [] })
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    quarterNew: QuarterData, regularRole: Role
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })
    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, quarterNew, regularRole)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, quarterNew, regularRole)
    })
}

const doReply = async (
    interaction: ChatInputCommandInteraction,
    year: number | null, quarter: number | null,
    isEditing: boolean = false
) => {
    await interaction.deferReply({ephemeral: true})

    assert(interaction.guild !== null)

    const roleIds = await getRoleIds()
    const regularRole = await interaction.guild.roles.fetch(roleIds.regularRole)

    if (regularRole === null) {
        await interaction.editReply({ embeds: [regularRoleNotFoundEmbed] })
        return
    }

    let quarterNew: QuarterData
    if (year === null && quarter === null)
        quarterNew = nextQuarter(await getQuarterData())
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
        .addFields({
            name: "정회원 목록",
            value: regularRole.members.map(member => member.toString()).join("\n"),
            inline: false
        })

    const reply = await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply, quarterNew, regularRole)
}

export default { readOptions, doReply }
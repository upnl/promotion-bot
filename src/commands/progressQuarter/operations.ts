import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, Role } from "discord.js"
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
    quarter: interaction.options.getNumber("분기"),
    regularRole: interaction.options.getRole("정회원", true),
    associateRole: interaction.options.getRole("준회원", true)
})

const doConfirm = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    quarterNew: QuarterData, regularRole: Role, associateRole: Role,
) => {
    await buttonInteraction.deferReply()

    try {
        for (const [regularId, _] of regularRole.members) {
            await firebaseDb
                .collection(QUARTER).doc(await getQuarterDataString(quarterNew))
                .collection(REGULAR).doc(regularId)
                .withConverter(regularConverter)
                .set({ config: { goalScore: 10 } })
        }

        await setQuarterData(quarterNew)
        await setRoleIds({ regularRole: regularRole.id, associateRole: associateRole.id })

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
    quarterNew: QuarterData, regularRole: Role, associateRole: Role,
) => {
    await buttonInteraction.deferUpdate()

    const cancelEmbed = new EmbedBuilder(canceledEmbedPrototype.toJSON())
        .setDescription(makeBold(createQuarterDataString(quarterNew)))

    await buttonInteraction.message.edit({ embeds: [cancelEmbed], components: [] })
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    quarterNew: QuarterData, regularRole: Role, associateRole: Role,
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })
    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, quarterNew, regularRole, associateRole)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, quarterNew, regularRole, associateRole)
    })
}

const doReply = async (
    interaction: ChatInputCommandInteraction,
    year: number | null, quarter: number | null, regularRole: Role, associateRole: Role,
    isEditing: boolean = false
) => {
    await interaction.deferReply()

    assert(interaction.inGuild())

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
            name: "정회원",
            value: regularRole.toString(),
            inline: true
        })
        .addFields({
            name: "준회원",
            value: associateRole.toString(),
            inline: true
        })
        .addFields({
            name: "정회원 목록",
            value: regularRole.members.map(member => member.toString()).join("\n"),
            inline: false
        })

    const reply = await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply, quarterNew, regularRole, associateRole)
}

export default { readOptions, doReply }
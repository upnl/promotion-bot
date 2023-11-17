import builders from "./builders.js"
import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, GuildMember, InteractionResponse, Message, User } from "discord.js"
import { Mission, MissionUpdateData } from "../../../interfaces/models/Mission.js"
import { getMission, patchMission } from "../../../db/actions/missionActions.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { createMissionEditPreviewString, createMissionPreviewTitle } from "../../utils/createString/createMissionPreviewString.js"
import { checkAssociate } from "../../utils/checks/checkAssociate.js"
import { getQuarterDataFooter } from "../../utils/quarterData/getQuarterData.js"

const {
    missionNotFoundEmbed,
    noChangeEmbed,
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
    index: interaction.options.getNumber("번호", true) - 1,
    content: interaction.options.getString("내용"),
    note: interaction.options.getString("비고"),
    score: interaction.options.getNumber("점수")
})

const doConfirm = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    target: User, category: string, index: number, missionUpdateData: MissionUpdateData,
    missionNew: Mission, missionLast: Mission
) => {
    await buttonInteraction.deferReply()

    const success = await patchMission(interaction.user.id, target.id, category, index, missionUpdateData)

    if (success) {
        const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
            .addFields({ name: createMissionPreviewTitle(missionNew, target), value: createMissionEditPreviewString(missionNew, missionLast, target) })

        await buttonInteraction.deleteReply()
        await interaction.editReply({ embeds: [successEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }
    else
        await buttonInteraction.editReply({ embeds: [errorEmbed] })
}

const doCancel = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    target: User, category: string, index: number, missionUpdateData: MissionUpdateData,
    missionNew: Mission, missionLast: Mission
) => {
    await buttonInteraction.deferUpdate()

    const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
        .addFields({ name: createMissionPreviewTitle(missionNew, target), value: createMissionEditPreviewString(missionNew, missionLast, target) })

    await interaction.editReply({ embeds: [cancelEmbed.setFooter(await getQuarterDataFooter())], components: [] })
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    target: User, category: string, index: number, missionUpdateData: MissionUpdateData,
    missionNew: Mission, missionLast: Mission
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })

    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, target, category, index, missionUpdateData, missionNew, missionLast)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, target, category, index, missionUpdateData, missionNew, missionLast)
    })
}

const doReply = async (interaction: ChatInputCommandInteraction, target: User, category: string, index: number, missionUpdateData: MissionUpdateData, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply()

    if (!await checkAssociate(interaction, target.id, true))
        return

    if (missionUpdateData.content === undefined && missionUpdateData.note === undefined && missionUpdateData.score === undefined) {
        await interaction.editReply({ embeds: [noChangeEmbed] })
        return
    }

    const missionLast = await getMission(interaction.user.id, target.id, category, index)

    if (missionLast === null) {
        await interaction.editReply({ embeds: [missionNotFoundEmbed] })
        return
    }
    if (missionLast === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }

    const missionNew: Mission = {
        ...missionLast,
        ...missionUpdateData
    }

    const replyEmbed = new EmbedBuilder(replyEmbedPrototype.toJSON())
        .addFields({ name: createMissionPreviewTitle(missionNew, target), value: createMissionEditPreviewString(missionNew, missionLast, target) })
    const reply = await interaction.editReply({ embeds: [replyEmbed.setFooter(await getQuarterDataFooter())], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply, target, category, index, missionUpdateData, missionNew, missionLast)
}

export default {
    readOptions,
    doReply
}
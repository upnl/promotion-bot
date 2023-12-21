import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, ModalSubmitInteraction, User } from "discord.js"
import { getMission, patchMission } from "../../../db/actions/missionActions.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { checkAssociate } from "../../utils/checks/checkAssociate.js"
import { addConfirmCollector, createConfirmActionRow } from "../../utils/components/confirmActionRow.js"
import { createMissionModal, createMissionModalId, getMissionModalMission } from "../../utils/components/missionModal.js"
import { createMissionEditPreviewString, createMissionPreviewTitle } from "../../utils/createString/createMissionPreviewString.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { getQuarterDataFooter } from "../../utils/quarterData/getQuarterData.js"
import builders from "./builders.js"

const {
    commandId,
    missionNotFoundEmbed,
    invalidScoreEmbed,
    noChangeEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype
} = builders

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("대상", true),
    category: interaction.options.getString("카테고리", true),
    index: interaction.options.getNumber("번호", true) - 1,
})

const onConfirm = (
    interaction: ModalSubmitInteraction,
    target: User, category: string, index: number,
    missionNew: Mission, missionLast: Mission
) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferReply({ ephemeral: true })

        const success = await patchMission(interaction.user.id, target.id, category, index, missionNew)

        if (success) {
            const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
                .addFields({ name: createMissionPreviewTitle(missionNew, target), value: createMissionEditPreviewString(missionNew, missionLast, target) })

            await buttonInteraction.deleteReply()
            await interaction.editReply({ embeds: [successEmbed.setFooter(await getQuarterDataFooter())], components: [] })
        }
        else
            await buttonInteraction.editReply({ embeds: [errorEmbed] })
    }

const onCancel = (interaction: ModalSubmitInteraction, target: User, missionNew: Mission, missionLast: Mission) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferUpdate()

        const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
            .addFields({ name: createMissionPreviewTitle(missionNew, target), value: createMissionEditPreviewString(missionNew, missionLast, target) })

        await interaction.editReply({ embeds: [cancelEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }

export const doReply = async (interaction: ChatInputCommandInteraction, target: User, category: string, index: number, isEditing: boolean = false) => {
    if (!await checkAssociate(interaction, target.id, true))
        return

    const missionLast = await getMission(interaction.user.id, target.id, category, index)

    if (missionLast === null) {
        await interaction.reply({ embeds: [missionNotFoundEmbed], ephemeral: true })
        return
    }
    if (missionLast === undefined) {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        return
    }

    await interaction.showModal(createMissionModal(
        commandId, interaction.user, target,
        missionLast.category, missionLast.content, missionLast.score, missionLast.note
    ))

    const modalInteraction = await interaction.awaitModalSubmit({
        filter: mI => mI.customId === createMissionModalId(commandId, interaction.user),
        time: 60_000
    }).catch(_ => null)
    if (modalInteraction === null)
        return

    const missionNew = getMissionModalMission(modalInteraction, target, missionLast.completed)
    if (missionNew === undefined) {
        await modalInteraction.reply({ embeds: [invalidScoreEmbed], ephemeral: true })
        return
    }
    else if (missionNew.content === missionLast.content && missionNew.note === missionLast.note && missionNew.score === missionLast.score) {
        await modalInteraction.reply({ embeds: [noChangeEmbed], ephemeral: true })
        return
    }

    const reply = await modalInteraction.reply({
        embeds: [
            EmbedBuilder.from(replyEmbedPrototype)
                .addFields({ name: createMissionPreviewTitle(missionNew, target), value: createMissionEditPreviewString(missionNew, missionLast, target) })
                .setFooter(await getQuarterDataFooter())
        ],
        components: [createConfirmActionRow(commandId, modalInteraction.user)],
        ephemeral: true,
        fetchReply: true
    });

    if (!isEditing)
        await addConfirmCollector(
            commandId, modalInteraction, reply,
            onConfirm(modalInteraction, target, category, index, missionNew, missionLast),
            onCancel(modalInteraction, target, missionNew, missionLast)
        )
}
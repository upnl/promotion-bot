import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, ModalSubmitInteraction, User } from "discord.js"
import { postMission } from "../../../db/actions/missionActions.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { checkAssociate } from "../../utils/checks/checkAssociate.js"
import { addConfirmCollector, createConfirmActionRow } from "../../utils/components/confirmActionRow.js"
import { createMissionModal, createMissionModalId, getMissionModalMission } from "../../utils/components/missionModal.js"
import { createMissionPreviewString, createMissionPreviewTitle } from "../../utils/createString/createMissionPreviewString.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { getQuarterDataFooter } from "../../utils/quarterData/getQuarterData.js"
import builders from "./builders.js"

const {
    commandId,
    invalidScoreEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,
} = builders

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("대상", true)
})

const onConfirm = (modalInteraction: ModalSubmitInteraction, target: User, index: number, mission: Mission) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferReply({ ephemeral: true })

        const success = await postMission(index, mission)

        if (success) {
            const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
                .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

            await buttonInteraction.deleteReply()
            await modalInteraction.editReply({ embeds: [successEmbed.setFooter(await getQuarterDataFooter())], components: [] })
        }
        else
            await buttonInteraction.editReply({ embeds: [errorEmbed] })
    }

const onCancel = (modalInteraction: ModalSubmitInteraction, target: User, mission: Mission) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferUpdate()

        const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

        await modalInteraction.editReply({ embeds: [cancelEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }

export const doReply = async (interaction: ChatInputCommandInteraction, target: User, isEditing: boolean = false) => {
    if (!await checkAssociate(interaction, target.id, true))
        return

    await interaction.showModal(createMissionModal(commandId, interaction.user, target))

    const modalInteraction = await interaction.awaitModalSubmit({
        filter: mI => mI.customId === createMissionModalId(commandId, interaction.user),
        time: 60_000
    }).catch(_ => null)
    if (modalInteraction === null)
        return

    const modalValue = getMissionModalMission(modalInteraction, target)
    if (modalValue === undefined) {
        await modalInteraction.reply({ embeds: [invalidScoreEmbed], ephemeral: true })
        return
    }

    const { index, mission } = modalValue
    const reply = await modalInteraction.reply({
        embeds: [EmbedBuilder.from(replyEmbedPrototype)
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })
            .setFooter(await getQuarterDataFooter())],
        components: [createConfirmActionRow(commandId, modalInteraction.user)],
        ephemeral: true,
        fetchReply: true
    });

    if (!isEditing)
        await addConfirmCollector(
            commandId, modalInteraction, reply,
            onConfirm(modalInteraction, target, index, mission),
            onCancel(modalInteraction, target, mission)
        )
}
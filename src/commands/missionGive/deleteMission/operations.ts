import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, User } from "discord.js"
import { deleteMission, getMission } from "../../../db/actions/missionActions.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { checkAssociate } from "../../utils/checks/checkAssociate.js"
import { addConfirmCollector, createConfirmActionRow } from "../../utils/components/confirmActionRow.js"
import { createMissionPreviewString, createMissionPreviewTitle } from "../../utils/createString/createMissionPreviewString.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { getQuarterDataFooter } from "../../utils/quarterData/getQuarterData.js"
import builders from "./builders.js"

const {
    commandId,
    missionNotFoundEmbed,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype
} = builders

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("대상", true),
    category: interaction.options.getString("카테고리", true),
    index: interaction.options.getNumber("번호", true) - 1
})

const onConfirm = (interaction: ChatInputCommandInteraction, target: User, category: string, index: number, mission: Mission) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferReply({ ephemeral: true })

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

const onCancel = (interaction: ChatInputCommandInteraction, target: User, mission: Mission) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferUpdate()

        const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

        await interaction.editReply({ embeds: [cancelEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }

export const doReply = async (interaction: ChatInputCommandInteraction, target: User, category: string, index: number, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply({ ephemeral: true })

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

    const reply = await interaction.editReply({
        embeds: [EmbedBuilder.from(replyEmbedPrototype)
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })
            .setFooter(await getQuarterDataFooter())],
        components: [createConfirmActionRow(commandId, interaction.user)]
    });

    if (!isEditing)
        addConfirmCollector(
            commandId, interaction, reply,
            onConfirm(interaction, target, category, index, mission),
            onCancel(interaction, target, mission)
        )
}
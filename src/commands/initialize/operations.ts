import { ButtonInteraction, ChatInputCommandInteraction, EmbedBuilder, Role } from "discord.js"
import { addConfirmCollector, createConfirmActionRow } from "../utils/components/confirmActionRow.js"
import { errorEmbed } from "../utils/errorEmbeds.js"
import { setRoleIds } from "../utils/roleId/setRoleIds.js"
import builders from "./builders.js"

const {
    commandId,
    initializeEmbedPrototype,
    successEmbedPrototype,
    canceledEmbed
} = builders

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    chiefRole: interaction.options.getRole("넬장", true),
    regularRole: interaction.options.getRole("정회원", true),
    associateRole: interaction.options.getRole("준회원", true)
})

const onConfirm = (interaction: ChatInputCommandInteraction, chiefRole: Role, regularRole: Role, associateRole: Role) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferReply()

        try {
            await setRoleIds({ chiefRole: chiefRole.id, regularRole: regularRole.id, associateRole: associateRole.id })

            const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
                .addFields({ name: "넬장", value: chiefRole.toString(), inline: true })
                .addFields({ name: "정회원", value: regularRole.toString(), inline: true })
                .addFields({ name: "준회원", value: associateRole.toString(), inline: true })

            await buttonInteraction.deleteReply()
            await interaction.editReply({ embeds: [successEmbed], components: [] })
        }
        catch (e) {
            await buttonInteraction.editReply({ embeds: [errorEmbed] })
        }
    }

const onCancel = (interaction: ChatInputCommandInteraction) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferUpdate()
        await interaction.editReply({ embeds: [canceledEmbed], components: [] })
    }

export const doReply = async (
    interaction: ChatInputCommandInteraction,
    chiefRole: Role, regularRole: Role, associateRole: Role,
    isEditing: boolean = false
) => {
    await interaction.deferReply()

    const reply = await interaction.editReply({
        embeds: [EmbedBuilder.from(initializeEmbedPrototype)
            .addFields({ name: "넬장", value: chiefRole.toString(), inline: true })
            .addFields({ name: "정회원", value: regularRole.toString(), inline: true })
            .addFields({ name: "준회원", value: associateRole.toString(), inline: true })],
        components: [createConfirmActionRow(commandId, interaction.user)]
    });

    if (!isEditing)
        addConfirmCollector(
            commandId, interaction, reply,
            onConfirm(interaction, chiefRole, regularRole, associateRole),
            onCancel(interaction)
        )
}
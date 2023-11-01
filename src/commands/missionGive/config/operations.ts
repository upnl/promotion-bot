import builders from "./builders.js"
import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User } from "discord.js"
import { getAssociate, getRegular } from "../../../db/actions/memberActions.js"
import { deleteMission, getMission } from "../../../db/actions/missionActions.js"
import { errorEmbed } from "../../utils/embeds/errorEmbed.js"
import { createMissionPreviewEmbedField } from "../../utils/createString/createMissionString.js"
import { Mission } from "../../../interfaces/models/Mission.js"

const {
    notRegularEmbed,
    notAssociateEmbed,
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
    index: interaction.options.getNumber("번호", true)
})

const doConfirm = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    target: User, index: number,
    mission: Mission
) => {
    const success = await deleteMission(interaction.user.id, target.id, category, index)

    if (success) {
        const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON()).setDescription(createMissionPreviewEmbedField(mission, target))

        await buttonInteraction.deferUpdate()
        await buttonInteraction.message.edit({ embeds: [successEmbed], components: [] })
    }
    else
        await buttonInteraction.reply({ embeds: [errorEmbed] })
}

const doCancel = async (
    interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction,
    target: User, index: number,
    mission: Mission
) => {
    const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON()).setDescription(createMissionPreviewEmbedField(mission, target))

    await buttonInteraction.deferUpdate()
    await buttonInteraction.message.edit({ embeds: [cancelEmbed], components: [] })
}

const addCollector = (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    target: User, index: number,
    mission: Mission
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })

    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, target, index, mission)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, target, index, mission)
    })
}

const doReply = async (interaction: ChatInputCommandInteraction, target: User, category: string, index: number, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply()

    if (await getRegular(interaction.user.id) === undefined) {
        await interaction.editReply({ embeds: [notRegularEmbed] })
        return
    }
    else if (target.id !== interaction.user.id && await getAssociate(target.id) === undefined) {
        await interaction.editReply({ embeds: [notAssociateEmbed] })
        return
    }

    const mission = await getMission(interaction.user.id, target.id, category, index)

    if (mission === null) {
        await interaction.editReply({ embeds: [missionNotFoundEmbed] })
        return
    }
    if (mission === undefined) {
        await interaction.editReply({ embeds: [errorEmbed] })
        return
    }

    const replyEmbed = new EmbedBuilder(replyEmbedPrototype.toJSON()).setDescription(createMissionPreviewEmbedField(mission, target))
    const reply = await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply, target, index, mission)
}

export default {
    readOptions,
    doReply
}
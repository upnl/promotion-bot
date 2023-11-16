import builders from "./builders.js"
import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, User } from "discord.js"
import { postMission } from "../../../db/actions/missionActions.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { errorEmbed } from "../../utils/embeds/errorEmbed.js"
import { createMissionPreviewString, createMissionPreviewTitle } from "../../utils/createString/createMissionPreviewString.js"
import { checkAssociate } from "../../utils/checkRole/checkAssociate.js"

const {
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,
    confirmButtonId,
    cancelButtonId,
    actionRow
} = builders

const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("대상", true),
    category: interaction.options.getString("카테고리"),
    content: interaction.options.getString("내용", true),
    note: interaction.options.getString("비고"),
    score: interaction.options.getNumber("점수")
})

const doConfirm = async (interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction, target: User, mission: Mission) => {
    await buttonInteraction.deferReply()

    const success = await postMission(mission)

    if (success) {
        const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

        await buttonInteraction.deleteReply()
        await interaction.editReply({ embeds: [successEmbed], components: [] })
    }
    else
        await buttonInteraction.editReply({ embeds: [errorEmbed] })
}

const doCancel = async (interaction: ChatInputCommandInteraction, buttonInteraction: ButtonInteraction, target: User, mission: Mission) => {
    await buttonInteraction.deferUpdate()

    const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
        .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

    await interaction.editReply({ embeds: [cancelEmbed], components: [] })
}

const addCollector = async (
    interaction: ChatInputCommandInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    target: User, mission: Mission
) => {
    const collector = reply.createMessageComponentCollector({
        filter: i => i.user === interaction.user,
        componentType: ComponentType.Button
    })
    collector.on("collect", async buttonInteraction => {
        if (buttonInteraction.customId === confirmButtonId)
            doConfirm(interaction, buttonInteraction, target, mission)
        else if (buttonInteraction.customId === cancelButtonId)
            doCancel(interaction, buttonInteraction, target, mission)
    })
}


const doReply = async (interaction: ChatInputCommandInteraction, target: User, mission: Mission, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply()

    if (!await checkAssociate(interaction, target.id, true))
        return

    const replyEmbed = new EmbedBuilder(replyEmbedPrototype.toJSON())
        .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })
    const reply = await interaction.editReply({ embeds: [replyEmbed], components: [actionRow] });

    if (!isEditing)
        addCollector(interaction, reply, target, mission)
}

export default { readOptions, doReply }

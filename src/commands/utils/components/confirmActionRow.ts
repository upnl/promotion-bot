import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Collection, ComponentType, InteractionResponse, Message, MessageActionRowComponentBuilder, RepliableInteraction, User } from "discord.js";
import { timeoutEmbed } from "../errorEmbeds.js";

const createConfirmButtonId = (commandId: string, user: User) =>
    `${commandId}_confirm_${user.id}`

const createCancelButtonId = (commandId: string, user: User) =>
    `${commandId}_cancel_${user.id}`

export const createConfirmActionRow = (commandId: string, user: User) =>
    new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(new ButtonBuilder().setCustomId(createConfirmButtonId(commandId, user)).setLabel("확인").setStyle(ButtonStyle.Success))
        .addComponents(new ButtonBuilder().setCustomId(createCancelButtonId(commandId, user)).setLabel("취소").setStyle(ButtonStyle.Danger))

export const confirmFilter = (commandId: string, user: User) =>
    (buttonInteraction: ButtonInteraction) =>
        buttonInteraction.customId === createConfirmButtonId(commandId, user) ||
        buttonInteraction.customId === createCancelButtonId(commandId, user)

export const confirmCollect = (
    commandId: string, user: User,
    onConfirm: (buttonInteraction: ButtonInteraction) => Promise<void>,
    onCancel: (buttonInteraction: ButtonInteraction) => Promise<void>
) =>
    async (buttonInteraction: ButtonInteraction) => {
        if (buttonInteraction.customId === createConfirmButtonId(commandId, user))
            await onConfirm(buttonInteraction)
        else if (buttonInteraction.customId === createCancelButtonId(commandId, user))
            await onCancel(buttonInteraction)
    }

export const confirmTimeout = (modalInteraction: RepliableInteraction) =>
    async (collected: Collection<string, ButtonInteraction<CacheType>>) => {
        if (collected.size === 0)
            modalInteraction.editReply({ embeds: [timeoutEmbed], components: [] })
    }

export const addConfirmCollector = (
    commandId: string, modalInteraction: RepliableInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    onConfirm: (buttonInteraction: ButtonInteraction) => Promise<void>,
    onCancel: (buttonInteraction: ButtonInteraction) => Promise<void>
) => {
    const collector = reply.createMessageComponentCollector({
        filter: confirmFilter(commandId, modalInteraction.user),
        componentType: ComponentType.Button, time: 10_000, max: 1
    })

    collector.on("collect", confirmCollect(commandId, modalInteraction.user, onConfirm, onCancel))
    collector.on('end', confirmTimeout(modalInteraction));
}
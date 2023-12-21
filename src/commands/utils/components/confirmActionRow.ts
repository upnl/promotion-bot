import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, Collection, MessageActionRowComponentBuilder, ModalSubmitInteraction, User } from "discord.js";
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

export const confirmTimeout = (modalInteraction: ModalSubmitInteraction) =>
    async (collected: Collection<string, ButtonInteraction<CacheType>>) => {
        if (collected.size === 0)
            modalInteraction.editReply({ embeds: [timeoutEmbed], components: [] })
    }
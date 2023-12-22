import { ActionRowBuilder, ModalBuilder } from "@discordjs/builders"
import { ModalSubmitInteraction, TextInputBuilder, TextInputStyle, User } from "discord.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { isInteger, isNumber } from "../isNumeric.js"

const missionCategoryInputId = "mission-category"
const missionIndexInputId = "mission-index"
const missionContentInputId = "mission-content"
const missionScoreInputId = "mission-score"
const missionNoteInputId = "mission-note"

export const createMissionModalId = (commandId: string, user: User) =>
    `${commandId}_mission-modal_${user.id}`

export const createMissionModal = (
    commandId: string,
    giver: User,
    target: User,
    missionCategoryValue: string = "",
    missionIndexValue: number = 1,
    missionContentValue: string = "",
    missionScoreValue: number = 1,
    missionNoteValue: string = "",
) => {
    const missionCategoryInput = new TextInputBuilder()
        .setCustomId(missionCategoryInputId)
        .setLabel("카테고리")
        .setMaxLength(30)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("카테고리를 입력하세요")
        .setValue(missionCategoryValue !== "" ? missionCategoryValue : (giver === target ? "공통 조건" : "개인 조건"))

    const missionIndexInput = new TextInputBuilder()
        .setCustomId(missionIndexInputId)
        .setLabel("번호")
        .setMaxLength(3)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("미션 번호를 입력하세요")
        .setValue(missionIndexValue.toString())

    const missionContentInput = new TextInputBuilder()
        .setCustomId(missionContentInputId)
        .setLabel("내용")
        .setMaxLength(100)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("승격조건 내용을 입력하세요")
        .setValue(missionContentValue)

    const missionScoreInput = new TextInputBuilder()
        .setCustomId(missionScoreInputId)
        .setLabel("점수")
        .setMaxLength(3)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("승격조건 내용을 입력하세요")
        .setValue(missionScoreValue.toString())

    const missionNoteInput = new TextInputBuilder()
        .setCustomId(missionNoteInputId)
        .setLabel("비고")
        .setMaxLength(300)
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("비고 사항을 입력하세요")
        .setValue(missionNoteValue)

    return new ModalBuilder()
        .setCustomId(createMissionModalId(commandId, giver))
        .setTitle("승격조건")
        .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(missionCategoryInput))
        .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(missionIndexInput))
        .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(missionContentInput))
        .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(missionScoreInput))
        .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(missionNoteInput))
}

export const getMissionModalMission = (interaction: ModalSubmitInteraction, target: User, completed?: string[]) => {
    const category = interaction.fields.getTextInputValue(missionCategoryInputId)
    const index = interaction.fields.getTextInputValue(missionIndexInputId)
    const content = interaction.fields.getTextInputValue(missionContentInputId)
    const note = interaction.fields.getTextInputValue(missionNoteInputId)
    const score = interaction.fields.getTextInputValue(missionScoreInputId)

    if (!isNumber(score))
        return
    else if (!isInteger(index) || parseInt(index) <= 0)
        return

    const mission: Mission = {
        category,
        content,
        note,
        score: Number(score),
        giverId: interaction.user.id,
        targetId: target.id,
        completed: completed === undefined ? [] : completed
    }

    return { 
        index: parseInt(index) - 1,
        mission
    }
}
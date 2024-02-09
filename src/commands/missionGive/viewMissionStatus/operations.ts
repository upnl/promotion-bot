import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js"
import { createProgressString } from "../../utils/createString/createProgresString.js"
import { getQuarterDataFooter } from "../../utils/quarterData/getQuarterData.js"
import builders from "./builders.js"
import { getAllAssociateIds } from "../../../db/actions/memberActions.js"
import { getMissionProgress } from "../../../db/actions/missionProgressActions.js"
import { getMissionCount } from "../../../db/actions/missionActions.js"
import assert from "assert"

const {
    noAssociateEmbed
} = builders

export const doReply = async (interaction: ChatInputCommandInteraction, isEditing: boolean = false) => {
    if (!isEditing)
        await interaction.deferReply({ ephemeral: true })

    const associateIds = await getAllAssociateIds()
    if (associateIds === undefined) {
        await interaction.editReply({ embeds: [noAssociateEmbed] })
        return
    }

    const universalCount = await getMissionCount(interaction.user.id, interaction.user.id)

    const datas = await Promise.all(associateIds.map(async associateId => {
        const progress = await getMissionProgress(interaction.user.id, associateId)
        assert(progress !== undefined)
        return {
            targetName: await interaction.client.users.fetch(associateId).then(user => user.displayName),
            status: {
                universalCount,
                specificCount: await getMissionCount(interaction.user.id, associateId)
            },
            progress
        }
    }))

    await interaction.editReply({
        embeds: [new EmbedBuilder()
            .setTitle(`${interaction.user.displayName}이 제시한 승격조건 : 현황`)
            .addFields(datas.map(data => ({
                name: (data.progress.currentScore >= data.progress.goalScore ? ":white_check_mark:" : ":white_square_button:") + " " + data.targetName,
                value: `제시 현황: 공통조건 ${data.status.universalCount}개 / 개인조건 ${data.status.specificCount}개\n` +
                    `달성 현황: ${createProgressString(data.progress.currentScore, data.progress.goalScore)}`,
                inline: false
            })))
            .setFooter(await getQuarterDataFooter())]
    })
}
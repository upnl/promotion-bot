import { User } from "discord.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { makeItalic } from "./markdown.js"

export const createMissionPreviewTitle = (mission: Mission, target: User) =>
    (mission.giverId !== mission.targetId ? `${target.displayName}의 승격조건` : "공통조건") 

export const createMissionPreviewString = (mission: Mission, target: User) =>
    `- ${mission.category} - ${mission.content} [${mission.score}점]` + (mission.note !== "" ? `\n  - ${mission.note}` : "")

export const createMissionEditPreviewString = (missionNew: Mission, missionLast: Mission, target: User) =>
    `${makeItalic(missionNew.category, missionNew.category !== missionLast.category)} ` +
    `- ${makeItalic(missionNew.content, missionNew.content !== missionLast.content)} ` +
    `[${makeItalic(`${missionNew.score}점`, missionNew.score !== missionLast.score)}]` +
    (missionNew.note !== "" ? `\n  - ${makeItalic(missionNew.note, missionNew.note !== missionLast.note)}` : "")
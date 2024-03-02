import { Mission } from "../../../interfaces/models/Mission.js"
import { isDefaultCategory } from "./createMissionString.js"
import { createNoteString } from "./createNoteString.js"

const createMissionPrintString = (mission: Mission, targetId: string) =>
    `- ${mission.content} \\[${mission.score}점\\]` + (mission.completed.includes(targetId) ? " (완료)" : "") +
    createNoteString(mission.note)

export const createMissionMapPrintString = (missionMap: Map<string, Mission[]>, targetId: string) => missionMap.size > 0 ?
    Array.from(missionMap)
        .filter(([_, missions]) => missions.length !== 0)
        .sort(([category1, _], [__, ___]) => isDefaultCategory(category1) ? -1 : 0)
        .map(([category, missions]) => (!isDefaultCategory(category) ? `### ${category}\n` : "") +
            missions.map(mission => createMissionPrintString(mission, targetId)).join("\n"))
        .join("\n") :
    "제시된 조건이 없습니다"

export const createProgressPrintString = (currentScore: number, goalScore: number) =>
    `- 목표: ${goalScore}점\n` +
    `- 현재: ${currentScore}점`
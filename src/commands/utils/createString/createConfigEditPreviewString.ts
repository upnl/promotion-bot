import { ConfigData } from "../../../interfaces/models/Config.js";

export const createConfigEditPreviewString = (configNew: ConfigData, configLast: ConfigData): string => {
    const edits: string[] = []

    if (configNew.goalScore !== configLast.goalScore)
        edits.push(`**목표 점수**\n- ${configLast.goalScore}점 -> ${configNew.goalScore}점`)

    return edits.join("\n")
}
import { readFileSync } from "fs";
import { QuarterData } from "../../../interfaces/models/QuarterData.js";
import { readFile } from "fs/promises";

export const getQuarterData = async (): Promise<QuarterData> => {
    const jsonRaw = await readFile("quarterData.json", "utf8")

    return JSON.parse(jsonRaw)
}

export const getQuarterDataString = async (quarterData?: QuarterData): Promise<string> => {
    if (quarterData === undefined)
        quarterData = await getQuarterData()
    
    return `${quarterData.year}-${quarterData.quarter}`
}
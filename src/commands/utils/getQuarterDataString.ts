import { readFileSync } from "fs";

export const getQuarterDataString = (): string => {
    const jsonRaw = readFileSync("quarterData.json", "utf8")

    const quarterData = JSON.parse(jsonRaw)

    return `${quarterData.year}-${quarterData.quarter}`
}
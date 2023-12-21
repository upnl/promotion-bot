import { writeFile } from "fs/promises"
import { QuarterData } from "../../../interfaces/models/QuarterData.js"

export const setQuarterData = async (quarterData: QuarterData) => {
    await writeFile("quarterData.json", JSON.stringify(quarterData), "utf8")
}
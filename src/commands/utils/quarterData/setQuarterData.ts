import { QuarterData } from "../../../interfaces/models/QuarterData.js"
import { writeFile } from "fs/promises"

export const setQuarterData = async (quarterData: QuarterData) => {
    await writeFile("quarterData.json", JSON.stringify(quarterData), "utf8")
}
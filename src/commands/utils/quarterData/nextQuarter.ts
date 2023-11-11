import { QuarterData } from "../../../interfaces/models/QuarterData.js";

export const nextQuarter = (currentQuarter: QuarterData): QuarterData => {
    if (currentQuarter.quarter === 1)
        return {
            year: currentQuarter.year,
            quarter: 2
        }
    if (currentQuarter.quarter === 2)
        return {
            year: currentQuarter.year,
            quarter: 3
        }
    if (currentQuarter.quarter === 3)
        return {
            year: currentQuarter.year,
            quarter: 4
        }
    else
        return {
            year: currentQuarter.year + 1,
            quarter: 1
        }
}
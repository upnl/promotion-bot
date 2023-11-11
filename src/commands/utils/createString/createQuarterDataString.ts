import { QuarterData } from "../../../interfaces/models/QuarterData.js";

export const createQuarterDataString = (quarterData: QuarterData) =>
    `${quarterData.year}년도 ${quarterData.quarter}분기`

const getGreenNum = (progress: number) => progress < 0 ? 0 : (progress < 1 ? Math.floor(progress * 8) : 8);

export const createProgressString = (currentScore: number, goalScore: number) => ":large_blue_diamond:" +
    ":green_square:".repeat(getGreenNum(currentScore / goalScore)) +
    ":black_large_square:".repeat(8 - getGreenNum(currentScore / goalScore)) +
    ":large_blue_diamond:" + " " +
    `(${currentScore}점/${goalScore}점)`;

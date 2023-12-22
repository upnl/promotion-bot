export const isInteger = (value: string) =>
    /^-?\d+$/.test(value);

export const isNumber = (value: string) =>
    /^-?\d+\.?\d*$/.test(value);


import { RoleIds } from "../../../interfaces/models/RoleIds.js";
import { readFile } from "fs/promises";

export const getRoleIds = async (): Promise<RoleIds> => {
    const jsonRaw = await readFile("roleIds.json", "utf8")

    return JSON.parse(jsonRaw)
}
import { writeFile } from "fs/promises"
import { RoleIds } from "../../../interfaces/models/RoleIds.js"

export const setRoleIds = async (roleIds: RoleIds) => {
    await writeFile("roleIds.json", JSON.stringify(roleIds), "utf8")
}
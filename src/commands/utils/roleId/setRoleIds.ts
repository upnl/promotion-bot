import { writeFileSync } from "fs"
import { RoleIds } from "../../../interfaces/models/RoleIds.js"
import { writeFile } from "fs/promises"

export const setRoleIds = async (roleIds: RoleIds) => {
    await writeFile("roleIds.json", JSON.stringify(roleIds), "utf8")
}
import { EmbedBuilder } from "discord.js"
import { createHelpEmbedFields } from "../utils/createString/createHelpString.js"

const createHelpEmbed = () => new EmbedBuilder().setTitle("도움말").addFields(createHelpEmbedFields())

export default { createHelpEmbed }
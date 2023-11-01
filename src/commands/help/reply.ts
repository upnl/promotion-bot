import assert from "assert"
import builders from "./builders.js"
import { Interaction } from "discord.js"

const { createHelpEmbed } = builders

const reply = async (interaction: Interaction) => {
    assert(interaction.isRepliable())

    await interaction.reply({ embeds: [createHelpEmbed()] })
}

export default reply
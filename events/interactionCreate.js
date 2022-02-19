module.exports = async (client, interaction) => {
    if (!interaction.inGuild()) return;
    if (interaction.isButton()) {
        if (interaction.customId === "give-poker-role") {
            let pokerRole = interaction.guild.roles.cache.find((r) => r.name.toLowerCase() == "poker");
            if (!pokerRole) {
                interaction.reply({
                    content: "There is no poker role set up in the server",
                    ephemeral: true
                })
            } else {
                try {
                    if (interaction.member.roles.cache.has(pokerRole.id)) {
                        await interaction.member.roles.remove(pokerRole.id)
                    } else {
                        await interaction.member.roles.add(pokerRole.id)
                    }
                    return await interaction.reply({
                        content: "Updated roles",
                        ephemeral: true
                    })
                } catch (e) {
                    return await interaction.reply({
                        content: "Could not update roles",
                        ephemeral: true
                    })
                }
            }
        }
    }
}
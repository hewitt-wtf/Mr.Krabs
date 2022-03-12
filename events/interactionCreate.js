const { allGames } = require("#poker");
const { CustomEmbed } = require("#structures");
const mergeImg = require("merge-img");
const path = require("path")

module.exports = async (bot, interaction) => {
	console.log("fired")
	if (!interaction.inGuild()) return;
	if (interaction.isCommand()) {
		let { commandName } = interaction
		let cmd = bot.commands.get(commandName)
		if (!cmd || !cmd.slash) return

		const send = (content, private = false) => {
			if(typeof content != "string"){
				if(private){
					content.ephemeral = true
					interaction.reply(content)
				}
			} else {
				interaction.reply({
					content,
					ephemeral: private
				})
			}
		}
		
		cmd.execute({ bot, interaction, send })
	}
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
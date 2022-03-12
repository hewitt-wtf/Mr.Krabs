const { CustomEmbed } = require("#structures")
const { MessageButton, MessageActionRow } = require("discord.js")
const { Round, allGames } = require("#poker")
module.exports = {
	name: "hand",
	description: "Show current hand",
	slash: true,
	execute: async ({ bot, interaction, send }) => {
		let egg = allGames.find((g) => g.channel.id === interaction.channel.id)
    console.log("sussy")
		if (!egg) {
			send("No poker game currently on", true)
		} else {
			await interaction.deferReply()
			let player = egg.players.find((i) => i.id === interaction.user.id)
			if (player) {
				let embed = new CustomEmbed()
					.setTitle("Your Cards")
					.setDescription(hand.map((c) => c.name).join(", "))
				let img = await mergeImg(hand.map((c) => path.join(process.cwd(), c.img)))
				interaction.editReply({
					embeds: [embed]
				})
			} else {
				interaction.editReply({ content: "No game?" })
			}
		}
	}
}
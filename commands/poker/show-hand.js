const { CustomEmbed } = require("#structures")
const { MessageButton, MessageActionRow } = require("discord.js")
const { Round, allGames } = require("#poker")
module.exports = {
	name: "hand",
	description: "Show current hand",
	slash: true,
	execute:async  ({ bot, interaction, send }) => {
		let egg = allGames.some((g) => g.channel.id === interaction.channel.id)
		if (!egg) {
			send("No poker game currently on", true)
			return;
		}
		let player = allGames.find((g) => g.players.includes(interaction.user.id))
		if (player) {
			let playerHand = allGames[player].players.find((v) => v == interaction.user.id)
			let hand = allGames[player][playerHand]
			let embed = new CustomEmbed()
				.setTitle("Your Cards")
				.setDescription(hand.map((c) => c.name).join(", "))
			let img = await mergeImg(hand.map((c) => path.join(process.cwd(), c.img)))
			interaction.reply({
				embeds: [embed]
			})
		}

	}
}
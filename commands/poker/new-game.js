const { CustomEmbed } = require("#structures")
const { MessageButton, MessageActionRow } = require("discord.js")

const { allGames, Game } = require("#poker")

module.exports = {
	name: "new-game",
	description: "Start A new Poker game",
	minArgs: 2,
	usage: "<start> <increment>",
	execute: async ({ message, send, args }) => {

		let [start, incre] = args;
		start = parseInt(start)
		incre = parseInt(incre)

		if (isNaN(start) || start % 50 != 0 || start < 500) {
			return send("Send a start amount bigger than 500");
		}
		if (incre < 5 || incre > 15) {
			return send("Send number between 5 and 15");
		}
		message.delete()
		let embed = new CustomEmbed()
			.setDescription("Start New Game!")
			.addField("Players", `${message.author}`)
		let button = new MessageButton()
			.setCustomId(`join-game`)
			.setLabel("Press To Join Game!")
			.setStyle("SUCCESS");
		let pokerRole = message.guild.roles.cache.find((r) => r.name.toLowerCase() == "poker");
		if (!pokerRole) {
			return send("There is no poker role")
		}


		let players = new Set()
		players.add(message.author.id)

		let msg = await message.channel.send({
			content: `${pokerRole}! Time to lose some money!`,
			embeds: [embed],
			components: [new MessageActionRow().setComponents([button])]
		})

		const time = 60 * 1000 * 2
		const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 5000 });

		collector.on('collect', i => {
			players.add(i.user.id)
			embed.spliceFields(0, 1, {
				name: "Players",
				value: [...players].map((p) => `<@!${p}>`).join(", ")
			})
			i.reply({
				content: "You have joined the game",
				ephemeral: true
			})
			msg.edit({
				embeds: [embed]
			})
		})

		collector.on('end', collected => {
			if (players.size > 1) {
				msg.edit({
					components: [],
				})
				allGames.push(new Game(start, incre, message.channel, [...players]));
			} else {
				msg.edit({
					content: "No one wants to play poker",
					embeds: [],
					components: []
				})
			}
		});

	}

}
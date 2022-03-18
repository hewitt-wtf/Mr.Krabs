const { CustomEmbed } = require("#structures");
const { MessageButton, MessageActionRow } = require("discord.js");
const { allGames, Game } = require("#poker");

module.exports = {
	name: "game",
	slash: true,
	description: "Start A new Poker game",
	minArgs: 2,
	usage: "<start> <increment>",
	options: [{
		name: "start_chips",
		description: "Multiple of 50 more than 500",
		type: "INTEGER",
		minValue: 500,
		required: true
	}, {
		name: "increment",
		description: "Time between Blind increase, 5-15 min",
		type: "INTEGER",
		minValue: 5,
		maxValue: 15,
		required: true
	}, {
		name: "friendly",
		description: "Freidnly game without economic impacts?",
		type: "BOOLEAN",
		required: false
	}],
	execute: async ({ interaction, send }) => {

		let start = interaction.options.getInteger("start_chips");
		let incre = interaction.options.getInteger("increment");
		let friendly = interaction.options.getBoolean("friendly") ?? false;
		if (isNaN(start) || start % 50 != 0 || start < 500) {
			return send({embeds: [new CustomEmbed().setDescription("Multiple of 50 more than 500")]});
		}
		let embed = new CustomEmbed()
			.setDescription("A new game has started. Maximum of 6 players")
			.addField("Players", `${interaction.user}`)
			.setDescription("Entry Chips: " + start + "\nincrements: " + incre + " minutes");
		let button = new MessageButton()
			.setCustomId(`join-game`)
			.setLabel("Press To Join Game!")
			.setStyle("SUCCESS");
		let pokerRole = interaction.guild.roles.cache.find((r) => r.name.toLowerCase() == "poker");
		if (!pokerRole) {
			return send("There is no poker role");
		}


		let players = new Set();
		players.add(interaction.user.id);

		let msg = await interaction.reply({
			content: `${pokerRole}! Time to lose some money!`,
			embeds: [embed],
			components: [new MessageActionRow().setComponents([button])],
			fetchReply: true
		});

		const time = 60 * 1000 * 2;
		const collector = msg.createMessageComponentCollector({ componentType: "BUTTON", time: 5000 });

		collector.on("collect", i => {
			players.add(i.user.id);
			if(players.size === 6) collector.end("heheheha")
			embed.spliceFields(0, 1, {
				name: "Players",
				value: [...players].map((p) => `<@!${p}>`).join(", ")
			});
			i.reply({
				content: "You have joined the game",
				ephemeral: true
			});
			msg.edit({
				embeds: [embed]
			});
		});

		collector.on("end", collected => {
			if (players.size > 1) {
				msg.edit({
					components: []
				});
				allGames.push(new Game(start, incre, interaction.channel, [...players], friendly));
			} else {
				msg.edit({
					embeds: [new CustomEmbed().setDescription("No one wants to play poker")],
					components: []
				});
			}
		});

	}

};
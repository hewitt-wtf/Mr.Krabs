const { CustomEmbed, DB } = require("#structures");
const path = require("path");
const medals = ["🥇", "🥈", "🥉"];
module.exports = {
    name: "economy",
    aliases: ["eco"],
    description: "Get the richest users",
    execute: async ({ bot, message, send }) => {
        message.delete();
        let leaderboard = [...bot.db.users.sort((a, b) => b.money - a.money).values()];

        let description = [];
        for (let i = 0; i < Math.min(leaderboard.length, 10); i++) {
            let user = leaderboard[i];
            description.push(`${medals[i] ?? `${i}`}: ${(await bot.users.fetch(user.userId)).tag} ${(await bot.db.getUserData(user.id)).money}`);
        }

        if (description.length == 0) {
            let embed = new CustomEmbed()
                .setDescription("Looks like nobody is saved on our cache")
                .setColor("RANDOM");
            send({ embeds: [embed] });
        } else {
            let embed = new CustomEmbed()
                .setTitle("Top 10 on the Economy:")
                .setDescription(description.join("\n"));
            send(embed);
        }
    }
};
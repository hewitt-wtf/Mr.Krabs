const { CustomEmbed } = require("#structures");

const medals = ["🥇", "🥈", "🥉"];
module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    description: "Get top poker users!",
    execute: async ({ bot, message, send }) => {
        message.delete();
        let leaderboard = [...bot.db.users.sort((a, b) => b.wins - a.wins).values()];

        let description = [];
        for (let i = 0; i < Math.min(leaderboard.length, 10); i++) {
            let user = leaderboard[i];
            description.push(`${medals[i] ?? `${i}`}: ${(await bot.users.fetch(user.userId)).tag}`);
        }

        if (description.length == 0) {
            send("Looks like nobody is saved on our cache");
        } else {
            let embed = new CustomEmbed()
                .setTitle("Top 10 Poker Players")
                .setDescription(description.join("\n"));
            send(embed);
        }
    }
};
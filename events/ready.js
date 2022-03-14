const { log } = require("#utils");
const { CronJob } = require("cron");
module.exports = (bot) => {
  log(`Logged in as ${bot.user.tag}`, "ready")

  let activity = 0;
  const setActivity = () => {
    let statuses = [
      {
        url: 'https://www.youtube.com/watch?v=o-YBDTqX_ZU',
        type: "STREAMING",
        name: "PLANKTONS ROBOTIC REVENGE"
      },
      {
        url: "https://www.youtube.com/watch?v=Sag4AGymNr0",
        name: "Clash Royale",
        type: "STREAMING"
      },
      {
        url: "https://www.youtube.com/watch?v=sAn7baRbhx4",
        name: "OnlyFans Sports Streaming Service",
        type: "STREAMING"
      },
      {
        name: "Invade Ukraine Simulator",
        type: "PLAYING"
      },
      {
        name: "The Spongebob Podcast",
        type: "LISTENING"
      },
      {
        name: "Krabby Patty Making Contest",
        type: "COMPETING"
      },
      {
        url:"https://www.youtube.com/watch?v=QSo0duY7-9s",
        name: "definetly not the Spanish Inquisition",
        type: "STREAMING",
      }
    ];

    if (++activity > statuses.length - 1) activity = 0;
    let { name, type, url } = statuses[activity];

    bot.user.setPresence({
      activities: [{ name, type, url }],
    });

  };

  for (const [id, guild] of bot.guilds.cache) {
    guild.commands.set(bot.commands.filter((c) => c.slash).map((c) => c))
  }

  bot.db.connect()
  new CronJob("*/30 * * * * *", setActivity, null, true, "America/Denver").start();
}
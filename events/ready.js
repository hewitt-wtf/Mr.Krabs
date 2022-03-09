const { log } = require("#utils");
const { CronJob } = require("cron");
module.exports = (bot) => {
  log(`Logged in as ${bot.user.tag}`, "ready")

  let activity = 0;
  const setActivity = () => {
    let statuses = [
      {
        url: 'https://www.youtube.com/watch?v=o-YBDTqX_ZU',
        type: "PLAYING",
        name: "PLANKTONS ROBOTIC REVENGE"
      },
      {
        name: "Clash Royale",
        type: "PLAYING"
      },
      {
        name: "OnlyFans Sports Streaming Service",
        type: "WATCHING"
      },
      {
        name: "Invade Ukraine Simulator",
        type: "PLAYING"
      },
    ];

    if (++activity > statuses.length - 1) activity = 0;
    let { name, type, url } = statuses[activity];

    bot.user.setPresence({
      activities: [{ name, type, url }],
    });

  };

	for(const [id, guild] of bot.guilds.cache){
		guild.commands.set(bot.commands.filter((c) => c.slash).map((c) => c))
	}
	
  bot.db.connect()
  new CronJob("*/30 * * * * *", setActivity, null, true, "America/Denver").start();
}
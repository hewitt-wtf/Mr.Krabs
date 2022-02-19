const {log} = require("#utils");
const {CronJob} = require("cron");
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
                name: "HEHEHEHA",
                type: "PLAYING"
            },
            {
                name: "Netflix",
                type: "WATCHING"
            }
        ];

        if (++activity > statuses.length - 1) activity = 0;
        let {name, type, url} = statuses[activity];

        bot.user.setPresence({
            activities: [{name, type, url}],
        });

    };

    bot.db.connect()
    new CronJob("*/30 * * * * *", setActivity, null, true, "America/Denver").start();
}
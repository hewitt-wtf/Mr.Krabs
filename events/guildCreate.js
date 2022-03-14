const { log } = require("#utils");

module.exports = async (bot, guild) => {
    try {
        await guild.roles.create({
            name: "Poker",
            color: "BLUE"
        });
    } catch {
        log(`Could not create poker role in ${guild.name}`, "error");
    }
};
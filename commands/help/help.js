const { CustomEmbed } = require("#structures");
const { formatString } = require("#utils")

module.exports = {
    name: "help",
    description: "Opens Help Menu",
    execute: ({ bot, message, send }) => {
        message.delete()
        let embed = new CustomEmbed()
            .setAuthor({
                name: `${bot.user.username} Commands`,
                iconURL: bot.user.displayAvatarURL()
            })
            .addFields(bot.commands.map((c) => {
                return {
                    name: formatString(c.name),
                    value: [
                        c.aliases ? c.aliases.join(", ") : "No Aliases",
                        c.description ?? "No Description"
                    ].join("\n"),
                    inline: false
                }
            }))
        send(embed)
    }
}

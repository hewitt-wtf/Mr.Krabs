const { CustomEmbed, Paginate } = require("#structures");
const { formatString, chunk } = require("#utils");

module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Opens Help Menu",
    execute: ({ bot, message }) => {
        message.delete();
        let commandArray = [...bot.commands.values()];
        let chunks = chunk(commandArray, 3);
        let embeds = [];
        for (const chunk of chunks) {
            embeds.push(new CustomEmbed()
                .setAuthor({
                    name: `${bot.user.username} Commands`,
                    iconURL: bot.user.displayAvatarURL()
                }).addFields(
                    chunk.map((c) => {
                        if (c.slash) prefix = "/";
                        else prefix = bot.prefix;
                        return {
                            name: formatString(c.name),
                            value: [
                                c.aliases ? `Aliases: ${c.aliases.map((a) => `\`!${a}\``).join(", ")}` : "No Aliases",
                                `Usage: \`${prefix}${c.name}${c.minArgs ? ` ${c.usage}` : ""}\``,
                                c.description ?? "No Description"
                            ].join("\n"),
                            inline: false
                        };
                    })
                ));
        }

        new Paginate(message, embeds, message.member);
    }
};

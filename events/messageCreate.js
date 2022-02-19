const {MessageEmbed} = require("discord.js")

module.exports = (bot, message) => {
    if (message.author.bot || !message.guild) return
    let args = message.content.split(" ")
    let command = args.shift().slice(bot.prefix.length)

    let cmd = bot.commands.get(command) || bot.commands.find((c) => c.aliases?.includes(command))
    if (!cmd) return

    const send = (content) => {
        if (content instanceof MessageEmbed) {
            message.channel.send({embeds: [content]})
        } else {
            message.channel.send(content)
        }
    }

    let text = args.join(" ")
    cmd.execute({bot, message, args, send, text})
}
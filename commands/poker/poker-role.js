const { CustomEmbed } = require("#structures")
const { MessageButton, MessageActionRow } = require("discord.js")
module.exports = {
    name: "poker-role",
    aliases: ["pr"],
    description: "Send message to get poker role",
    execute: ({ bot, message }) => {
        message.delete()
        let embed = new CustomEmbed()
            .setDescription("Click here to get poker role!")
        let button = new MessageButton()
            .setCustomId(`give-poker-role`)
            .setEmoji("<:chip:942554045862781008>")
            .setStyle("PRIMARY");
        message.channel.send({
            embeds: [embed],
            components: [new MessageActionRow().setComponents([button])]
        })
    }
}
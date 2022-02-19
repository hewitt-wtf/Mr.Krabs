const { CustomEmbed } = require("#structures")
const { MessageButton, MessageActionRow } = require("discord.js")
module.exports = {
    name: "test",
    execute: ({ bot, message, send }) => {
        message.delete()
        let embed = new CustomEmbed()
            .setDescription("Test")
            .setFooter({ text: "Raise, Fold, Check" })
        let button1 = new MessageButton()
            .setCustomId(`raise`)
            .setLabel("Raise")
            .setStyle("SUCCESS");
        let button2 = new MessageButton()
            .setCustomId(`Fold`)
            .setLabel("Fold")
            .setStyle("DANGER");
        let button3 = new MessageButton()
            .setCustomId(`Check`)
            .setLabel("Check")
            .setStyle("PRIMARY");
        message.channel.send({
            embeds: [embed],
            components: [
                new MessageActionRow().setComponents([button1, button2, button3]),
            ],
        })
    }
}
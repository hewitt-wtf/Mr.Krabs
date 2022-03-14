const { CustomEmbed } = require("#structures");
const { formatString } = require("#utils");
module.exports = {
    name: "girlfriend",
    description: "Egirl",
    aliases: ["gf"],
    execute: ({ bot, message, send, text }) => {
        message.delete();
        let embed = new CustomEmbed()
            .setTitle("HEHEHEHA")
            .setColor("WHITE")
            .setDescription("Lol you thought you were getting a free gf")
            .setImage("https://cdn.discordapp.com/attachments/942544616593432606/952658069366644806/Z.png");
        send({ embeds: [embed] });
    }
};
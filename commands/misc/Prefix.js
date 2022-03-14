const { CustomEmbed } = require("#structures");
const path = require("path");
const { MessageAttachment } = require("discord.js");
module.exports = {
  name: "prefix",
  description: "get Mr. Krabs prefix",
  slash: true,
  execute: async ({ bot, interaction, send }) => {
    let embed = new CustomEmbed()
      .setAuthor({name: "Welcome to Mr. Krabs", iconURL: "https://cdn.discordapp.com/emojis/942552968715198614.webp?size=160&quality=lossless"})
      .setDescription("The prefix for Mr. Krabs is: " + bot.prefix + "\nUse !help to open Help Menu")
    send({embeds: [embed]},true)
  }
};
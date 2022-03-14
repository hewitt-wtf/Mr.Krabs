const { CustomEmbed, DB } = require("#structures");
const { formatString } = require("#utils")
const path = require("path");
module.exports = {
  name: "daily",
  description: "Your Daily cash",
  slash: true,
  execute: async ({ bot, interaction, send }) => {
    let data = await bot.db.getUserData(interaction.user.id);
    data.money += 1000;
    bot.db.getUserData(interaction.user.id).money = data.money;
    let embed = new CustomEmbed()
      .setDescription("Collected Your Daily Cash")
      .addField("Bank", `${data.money ?? 0}` + " <:chip:942554045862781008> <:chipblue:942553377324281928> <:chipgreen:942553741998043207> <:chipblack:942552968715198614>")
    send({ embeds: [embed] }, true)
  }
}

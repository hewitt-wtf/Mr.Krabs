const { CustomEmbed } = require("#structures");
const getColors = require("get-image-colors")
module.exports = {
  name: "profile",
  usage: "<opt: user>",
  aliases: ["pf", "p", "pro"],
  description: "Check yours or someone elses profile!",
  execute: async ({ bot, message, send }) => {
    let target = message.mentions.members.first() ?? message.member

        let data = await bot.db.getUserData(target.id)
    let [colour] = await (getColors(target.user.displayAvatarURL({ format: "png" })))

    let embed = new CustomEmbed()
      .setTitle(`${target.displayName}'s Profile`)
      .setThumbnail(target.user.displayAvatarURL())
      .setColor(colour.hex())
      .addField("Total Games", `${data.wins + data.losses ?? 0}`)
      .addField("Wins", `${data.wins ?? 0}`)
      .addField("Losses", `${data.losses ?? 0}`)
      .addField("W/L ratio", `${data.wins + '/' + data.losses ?? 0}`)
      .addField("Bank", `${data.money ?? 0}` + " <:chip:942554045862781008> <:chipblue:942553377324281928> <:chipgreen:942553741998043207> <:chipblack:942552968715198614>")
    message.reply({ embeds: [embed] })
  }
}

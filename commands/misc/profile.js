const { CustomEmbed } = require("#structures");
const getColors = require("get-image-colors")
module.exports = {
    name: "profile",
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
            .addField("Wins", `${data.wins ?? 0}`)
            .addField("Losses", `${data.losses ?? 0}`)
        message.reply({ embeds: [embed] })
    }
}

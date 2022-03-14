const { CustomEmbed } = require("#structures");

const DAY_IN_MS = 86400000;
module.exports = {
    name: "daily",
    description: "Your Daily cash",
    slash: true,
    execute: async ({ bot, interaction, send }) => {
        let data = await bot.db.getUserData(interaction.user.id);

        if (data.lastDaily.getTime() > Date.now() - DAY_IN_MS) {
            let embed = new CustomEmbed(bot, interaction.user)
                .setTitle("Daily")
                .setDescription(`You already claimed your daily cash! Collect it <t:${Math.floor((data.lastDaily.getTime() + DAY_IN_MS) / 1000)}:R>`);
            return send({ embeds: [embed] }, true);
        }

        data.lastDaily = new Date();
        data.money += 1000;
        data.save();

        let embed = new CustomEmbed()
            .setDescription("Collected Your Daily Cash")
            .addField("Bank", `${data.money ?? 0}` + " <:chip:942554045862781008> <:chipblue:942553377324281928> <:chipgreen:942553741998043207> <:chipblack:942552968715198614>");
        return send({ embeds: [embed] }, true);
    }
};

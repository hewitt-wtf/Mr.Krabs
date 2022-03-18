const { CustomEmbed } = require("#structures");
const { allGames } = require("#poker");
const mergeImg = require("merge-img");
const path = require("path");
const { MessageAttachment } = require("discord.js");
module.exports = {
    name: "hand",
    description: "Show current hand",
    slash: true,
    execute: async ({ bot, interaction, send }) => {
        let egg = allGames.find((g) => g.channel.id === interaction.channel.id);
        if (!egg) {
            send("No poker game currently on", true);
        } else {
            await interaction.deferReply({
                ephemeral: true
            });
            let player = egg.players.find((i) => i.id === interaction.user.id);
            if (player) {
                let { hand } = player;
                let embed = new CustomEmbed()
                    .setTitle("Your Cards")
                    .setDescription(hand.map((c) => c.name).join(", "))
                    .setImage("attachment://hand.png");
                let img = await mergeImg(
                    hand.map((c) => c.img)
                );
                img.getBuffer("image/png", (err, buffer) => {
                    interaction.editReply({
                        embeds: [embed],
                        files: [
                            new MessageAttachment(buffer, "hand.png")
                        ]
                    });
                });
            } else {
                interaction.editReply({ content: "https://i.kym-cdn.com/entries/icons/original/000/039/393/cover2.jpg" });
            }
        }
    }
};
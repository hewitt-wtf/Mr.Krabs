/*
	code based off of previous code i wrote
	https://github.com/HK-Yeet/SomeBot/blob/main/src/structures/ButtonPaginate.ts
*/

const { MessageButton, MessageActionRow } = require("discord.js");

class Paginate {
    constructor(
        message,
        embeds,
        member
    ) {
        this.message = message;
        this.embeds = embeds;
        this.member = member;
        // for (let i = 1; i < this.embeds.length; i++) {
        //     this.embeds[i].setColor(embeds[0].color);
        // }
        this.createCollector();
    }

    async createCollector() {
        let { message, embeds, member } = this;

        let buttons = [
            new MessageButton()
                .setCustomId("left")
                .setLabel("❮")
                .setStyle("SECONDARY")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("right")
                .setLabel("❯")
                .setStyle("PRIMARY"),
        ];
        let msg = await message.channel.send({
            embeds: [embeds[0].setFooter({
                text: `Page 1/${embeds.length}`
            })],
            components: [new MessageActionRow().addComponents(buttons)],
        });
        const collector = msg.createMessageComponentCollector({
            idle: 1000 * 30,
            dispose: true,
            componentType: "BUTTON"
        });
        let page = 0;
        let maxPages = embeds.length;

        collector.on("collect", async (i) => {
            if (message.author.id != member.id) {
                i.reply({
                    content: `This is locked to ${member.displayName}`,
                    ephemeral: true,
                });
                return;
            }
            if (i.customId == "right") {
                ++page;
                if (page == maxPages - 1) {
                    buttons[1].setDisabled(true);
                    buttons[1].setStyle("SECONDARY");
                    buttons[0].setDisabled(false);
                    buttons[0].setStyle("PRIMARY");
                } else {
                    buttons.forEach((button) => {
                        button.setDisabled(false);
                        button.setStyle("PRIMARY");
                    });
                }
                i.update({
                    embeds: [embeds[page].setFooter({
                        text: `Page ${page + 1}/${embeds.length}`
                    })],
                    components: [new MessageActionRow().addComponents(buttons)],
                });
            } else if (i.customId == "left") {
                --page;
                if (page == 0) {
                    buttons[0].setDisabled(true);
                    buttons[0].setStyle("SECONDARY");
                    buttons[1].setDisabled(false);
                    buttons[1].setStyle("PRIMARY");
                } else {
                    buttons.forEach((button) => {
                        button.setDisabled(false);
                        button.setStyle("PRIMARY");
                    });
                }

                i.update({
                    embeds: [embeds[page].setFooter({
                        text: `Page ${page + 1}/${embeds.length}`
                    })],
                    components: [new MessageActionRow().addComponents(buttons)],
                });
            }
        });

        collector.on("end", async () => {
            await msg.edit({
                components: [
                    new MessageActionRow().addComponents(
                        buttons.map((b) => b.setStyle("SECONDARY").setDisabled(true))
                    ),
                ],
            });
        });
    }
}

module.exports = Paginate;
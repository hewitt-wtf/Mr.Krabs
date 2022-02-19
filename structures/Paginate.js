/*
	code based off of previous code i wrote
	https://github.com/HK-Yeet/SomeBot/blob/main/src/structures/ButtonPaginate.ts
*/

class Paginate {
    constructor(
        message,
        embeds,
        member
    ) {
        this.message = message;
        this.embeds = embeds;
        this.member = member;
        for (let i = 1; i < this.embeds.length; i++) {
            this.embeds[i].setColor(embeds[0].color);
        }
        this.createCollector();
    }

    async createCollector() {
        let { message, embeds, member } = this;
        if (!interaction.deferred) await interaction.deferReply();
        const collector = interaction.channel.createMessageComponentCollector({
            idle: 1000 * 30,
            dispose: true,
        });
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
        await interaction.editReply({
            embeds: [embeds[0].setFooter(`Page 1/${embeds.length}`)],
            components: [new MessageActionRow().addComponents(buttons)],
        });

        let page = 0;
        let maxPages = embeds.length;

        collector.on("collect", async (i) => {
            if (i.message.id != (await interaction.fetchReply()).id) return;
            if (i.user.id != member.id) {
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
                    embeds: [embeds[page].setFooter(`Page ${page + 1}/${embeds.length}`)],
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
                    embeds: [embeds[page].setFooter(`Page ${page + 1}/${embeds.length}`)],
                    components: [new MessageActionRow().addComponents(buttons)],
                });
            }
        });

        collector.on("end", async () => {
            await interaction.editReply({
                components: [
                    new MessageActionRow().addComponents(
                        buttons.map((b) => b.setStyle("SECONDARY").setDisabled(true))
                    ),
                ],
            });
        });
    }
}

export default ButtonPaginate;
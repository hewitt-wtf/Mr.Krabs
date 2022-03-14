const { MessageEmbed } = require("discord.js");

class CustomEmbed extends MessageEmbed {
    constructor() {
        super();
        this.setColor("RED");
    }
}

module.exports = CustomEmbed;
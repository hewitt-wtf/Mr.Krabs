const { Client, Collection } = require("discord.js");
const { getFiles, log } = require("#utils");
const path = require("path");
const DB = require("./DB");

class KrabsClient extends Client {
    constructor({ token, prefix }) {
        super({
            intents: ["GUILDS", "GUILD_MESSAGES"],
            allowedMentions: {
                repliedUsers: false,
                users: [],
                roles: []
            }
        });

        this.commands = new Collection();
        this.token = token;
        this.prefix = prefix;
        this.db = new DB(this);
    }

    loadCommands(dir) {
        const files = getFiles(dir);
        for (const file of files) {
            let command = require(file);
            if (command.minArgs && !command.usage) throw new Error(`Add command usage to ${command.name}`);
            this.commands.set(command.name, command);
        }
        log(`Loaded ${this.commands.size} commands`, "info");
    }

    loadEvents(dir) {
        const files = getFiles(dir);
        for (const file of files) {
            let event = require(file);
            let fileName = file.split(path.sep).pop();
            let eventName = fileName.split(".")[0];

            super.on(eventName, event.bind(null, this));
        }
        log(`Loaded ${files.length} events`, "info");
    }
}

module.exports = KrabsClient;
/*
	code from https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/examples/making-an-eval-command.md#:~:text=an%20Eval%20command-,What%20is%20eval%20exactly%3F,)%20%2C%20eval%20will%20return%204%20.

help test simple js
*/

module.exports = {
    name: "eval",
    minArgs: 1,
    usage: "code",
    execute: async ({ bot, text, message }) => {
        if (message.author.id != "788927424166756363") return;
        try {
            const evaled = eval(text);
            const cleaned = await clean(evaled);
            message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``);
        }
    }
};

const clean = async (text) => {
    if (text && text.constructor.name == "Promise")
        text = await text;

    if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 1 });

    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));

    return text;
};
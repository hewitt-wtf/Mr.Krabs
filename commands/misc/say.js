const { CustomEmbed } = require("#structures");
const { formatString } = require("#utils");
module.exports = {
    name: "say",
    description: "Say...",
    execute: ({ bot, message, send, text }) => {
        message.delete();
        send(text);
    }
};

const { CustomEmbed } = require("#structures");
const { MessageButton, MessageActionRow } = require("discord.js");
module.exports = {
    name: "poker-role",
    aliases: ["pr", "prole"],
    description: "Send message to get poker role",
    execute: ({ bot, message }) => {
        message.delete();
        let embed = new CustomEmbed()
            .setDescription("Click here to get poker role!");
        let button = new MessageButton()
            .setCustomId(`give-poker-role`)
            .setEmoji("<:chip:942554045862781008>")
            .setStyle("PRIMARY");
        message.channel.send({
            embeds: [embed],
            components: [new MessageActionRow().setComponents([button])]
        });
    }
};
/*
	https://www.toptal.com/chatbot/how-to-make-a-discord-bot
*/

// const express = require('express');
// const bodyParser = require('body-parser');
// const EventEmitter = require('events');

// const PORT = process.env.PORT || 80;

// const app = express();
// app.use(bodyParser.json());

// class WebhookListener extends EventEmitter {
//  listen() {
//    app.post('/kofi', (req, res) => {
//      const data = req.body.data;
//      const { message, timestamp } = data;
//      const amount = parseFloat(data.amount);
//      const senderName = data.from_name;
//      const paymentId = data.message_id;
//      const paymentSource = 'Ko-fi';

//      // The OK is just for us to see in Postman. Ko-fi doesn't care
//      // about the response body, it just wants a 200.
//      res.send({ status: 'OK' });

//      this.emit(
//        'donation',
//        paymentSource,
//        paymentId,
//        timestamp,
//        amount,
//        senderName,
//        message,
//      );
//    });

//    app.listen(PORT);
//  }
// }

// const listener = new WebhookListener();
// listener.listen();

// module.exports = listener;






// const mongoose = require("mongoose");
// const { Collection } = require("discord.js");

// const { mongoURI } = require("#root/config.json");
// const { log } = require("#utils");
// const userSchema = require("#schemas/user-schema");

// class DB {
//     constructor(client) {
//         this._client = client;

//         this.users = new Collection();
//         this.userSchema = userSchema;
//     }

//     async connect() {
//         await mongoose.connect(mongoURI);
//         log("Connected to Mongo DB", "info");
//     }

//     async getUserData(userId) {
//         if (this.users.has(userId)) {
//             return this.users.get(userId);
//         } else {
//             let result = await this.userSchema.findOne({ userId });
//             if (result) {
//                 this.users.set(userId, result);
//                 return result;
//             } else {
//                 let user = new this.userSchema({ userId });
//                 await user.save();
//                 this.users.set(userId, user);
//                 return user;
//             }
//         }
//     }

// 	async addBalance(userId, amount){
// 		let user = await this.getUserData(userId)
// 		user.money += amount;
// 		await user.save()
// 		return user.money
// 	}
// }

// module.exports = DB;
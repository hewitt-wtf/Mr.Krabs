const mongoose = require('mongoose');
const { Collection } = require("discord.js")

const { mongoURI } = require("#root/config.json")
const { log } = require("#utils");
const userSchema = require("#schemas/user-schema")

class DB {
    constructor(client) {
        this._client = client;

        this.users = new Collection();
        this.userSchema = userSchema;

    }

    async connect() {
        await mongoose.connect(mongoURI)
        log("Connected to Mongo DB", "info")
    }

    async getUserData(userId) {
        if (this.users.has(userId)) {
            return this.users.get(userId)
        } else {
            let result = await this.userSchema.findOne({ userId })
            if (result) {
                this.users.set(userId, result)
                return result
            } else {
                let user = new this.userSchema({ userId })
                await user.save()
                this.users.set(userId, user)
                return user
            }
        }
    }
}

module.exports = DB;
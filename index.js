//https://discord.js.org/#/docs/discord.js/stable

require('module-alias/register');

const Express = require("express");
const path = require("path");
const settings = require("./config.json");
const { KrabsClient } = require("#structures");
const { log } = require("#utils");
const bot = new KrabsClient(settings);

bot.loadCommands(path.join(__dirname, "commands"))
bot.loadEvents(path.join(__dirname, "events"))
bot.login()

process.on("uncaughtException", (e, o) => log(`${e} ${e.trace}`, "error"))

bot.on("ready", () => {

	const app = Express();

	app.set("view engine", "ejs");

	app.get("/", async (_, res) => {
		res.status(200).render("landing-page", { bot });
	});

	app.listen(443)

})
//Deletes every commands from every server yikes!!1!!11!!
require('dotenv').config()
const readline = require("readline");
const fs = require("node:fs");
const path = require('node:path');
const jsonc = require('jsonc');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const config = jsonc.parse(fs.readFileSync(path.join(__dirname, '../config/config.jsonc'), 'utf8'));
const token = process.env.TOKEN;


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

(async () => {
	const rest = new REST({ version: "10" }).setToken(token);
	
	if (!process.argv.includes("--global")) {
		rl.question(
			"Enter the guild id you wanted to delete commands: ",
			async (guild) => {
				console.log("Evil bot has been started to delete commands...");
				await rest
					.put(Routes.applicationGuildCommands(config.clientId, guild), {
						body: [],
					})
					.catch(console.log);
				console.log("Evil bot has done the deed, exiting...");
				rl.close();
			},
		);
	} else {
		console.log("Evil bot has been started to delete global commands...");
		await rest
			.put(Routes.applicationCommands(config.clientId), {
				body: [],
			})
			.catch(console.log);
		console.log("Evil bot has done the deed, exiting...");
		process.exit();
	}
})();

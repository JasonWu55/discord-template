require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');
const jsonc = require('jsonc');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const token = process.env.TOKEN;
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

(async () => {
	const rest = new REST({ version: "10" }).setToken(config.token);
	const commands = [];
	const commandsPath = path.join(__dirname, '../commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	const { clientId, guildId } = jsonc.parse(fs.readFileSync(path.join(__dirname, '../config/config.jsonc'), 'utf8'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
	}
	
	rl.question(
		"Enter the guild id you wanted to deploy commands: ",
		async (guild) => {
			console.log("Deploying commands to guild...");
			await rest
				.put(Routes.applicationGuildCommands(clientId, guild), {
					body: commands,
				})
				.catch(console.error);
			console.log("Successfully deployed commands!");
			rl.close();
		},
	);
})();

//depend
require('dotenv').config()
const fs = require('fs-extra');
const path = require('node:path');
const jsonc = require('jsonc');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const token = process.env.TOKEN;
const { deploy } = require('./deploy-commands')

process.on('unhandledRejection', (reason, promise, a) => {
  console.log(reason, promise, a)
})

console.log("Connecting to Discord...");

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
] });

// All variables stored in the client object
client.discord = require('discord.js');
client.config = jsonc.parse(fs.readFileSync(path.join(__dirname, 'config/config.jsonc'), 'utf8'));

client.locales = require(`./locales/${client.config.lang}.json`);

// Command handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}
deploy();

// Execute commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Event handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Login the bot

client.login(token).then(() => {
	client.user.setPresence({
	  status: client.config.activity.status,
	  activity: {
		name: client.config.activity.name,
		type: client.config.activity.type,
	   },
	 });
  });

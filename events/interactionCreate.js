const {PermissionFlagsBits} = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
  async execute(interaction, client) {
    if (interaction.isButton()) {}
    if (interaction.isSelectMenu()) {}
    if (interaction.isModalSubmit()) {}
  }
};
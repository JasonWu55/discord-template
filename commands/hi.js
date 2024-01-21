const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hi')
		.setDescription('Hello World')
    .addUserOption(input => 
      input.setName('user')
      .setDescription('Hello User')
      .setRequired(false)),
	async execute(interaction, client) {
    const added = interaction.options.getUser('user');
    const userid = interaction.options.getUser('user').id;
    interaction.reply(`Hello <@${userid}>!`);
	},
};
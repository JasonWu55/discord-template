module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
    process.stdout.write(`🚀 Ready! Logged in as \x1b[37;46;1m${client.user.tag}\x1b[0m (\x1b[37;46;1m${client.user.id}\x1b[0m)\n`);
	}
};
const chalk = require("chalk");

module.exports = {
	groups: [],
	name: "help",
	aliases: [],
	format: "",
	callback: async (core) => {
		core.log(chalk.cyanBright("aa!"));
	}
};
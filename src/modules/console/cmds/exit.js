const chalk = require("chalk");

module.exports = {
	groups: [],
	name: "Exit",
	aliases: [],
	format: "",
	callback: async (core) => {
		core.log(chalk.cyanBright("exiting, goodbye!"));
		return "exit";
	}
};
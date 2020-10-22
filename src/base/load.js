const callsite = require("callsite");
const path = require("path");
const chalk = require("chalk");

// load modules to give them with core network

module.exports = class {
	constructor(core) {
		this.core = core;

		return dir => {
			const origin = callsite()[1].getFileName();
			// get directory relative to origin and with root from here
			const new_dir = path.join(path.dirname(path.relative(__dirname, origin)), dir);
			const response = require(new_dir);

			const file_name = path.basename(new_dir, path.extname(new_dir));
			core.dlog(`${chalk.blueBright(file_name)}${chalk.white(" has been required")}`);

			switch (typeof response) {
				case "function": 
					return response(core);
				case "object":
					response.core = core;
					return response;
				default:
					return response;
			}
		}
	}
}
const chalk = require("chalk");
const loader = require("./load");

// core module

module.exports = class {
	constructor() {
		this.is_development = process.env.NODE_ENV === "dev";

		this.dlog(chalk.green("-- development mode started --"));
		this.log(chalk.blueBright("- Welcome -") + "\n");

		this.loader = new loader(this);
	}

	dgroup(label, collapsed) {
		if (this.is_development){
			if (!collapsed) {
				console.group("-> " + label);
			} else {
				console.groupCollapsed("-> " + label);
			}
		}
	}

	dgroupend() {
		if (this.is_development) {
			console.groupEnd();
			this.dlog("<")
		}
	}

	dlog(...args) {
		if (this.is_development)
			console.log(...args);
	}

	log(...args) {
		console.log(...args);
	}; 
};
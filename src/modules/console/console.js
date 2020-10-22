const chalk = require("chalk");
const readline = require("readline");
const events = require("events");
const { once } = require("process");

module.exports = core => {
	let cons = {};

	const rl = readline.createInterface(
		process.stdin,
	);

	(async () => {
		for await (const line of rl) {
			if (!cons.callback) {
				break;
			} else {
				cons.callback(line);
				if (!cons.callback) break;
			}
		}
	})();

	core.cons = cons;

	core.loader("./commands");
}
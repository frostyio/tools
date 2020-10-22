const fs = require("fs");
const chalk = require("chalk");
const { parse } = require("path");

const get_directories = source =>
	fs.readdirSync(source, { withFileTypes: true }).map(dirent => dirent.name);

module.exports = async core => {
	const cons = core.cons;

	const config = {
		"prefix": ""
	};

	const cmds = [];

	const load_cmds = async (dir) => {
		const children = get_directories(dir);
		core.dgroup(chalk.green("commands"), true);
		for (file of children) {
			cmds.push(require(dir + file));
			core.dlog(chalk.green(file));
		}
		core.dgroupend();

		core.log(chalk.greenBright(`${cmds.length} command${cmds.length !== 1 ? "s" : ""} loaded!\n`));
		core.log(chalk.blueBright("type 'help' to get started!"));
	}

	const command_invalid_fallback = () => {
		core.log(chalk.blueBright("hey! looks like your command wasn't found, try again or type help for more info"));
	}

	const check_command = (cmd, input) => {
		input = input.toLowerCase();
		if (cmd.name.toLowerCase() == input) return true;
		for (alias of cmd.aliases) {
			if (alias.toLowerCase() == input) return true;
		}
		return false;
	}

	const get_commands_by_input = (group, input) => {
		let cmds = [];
		for (cmd of group) {
			if (check_command(cmd, input)) {
				cmds.push(cmd);
			}
		}
		return cmds;
	}

	const get_commands_by_group = group => {
		const lower = group.toLowerCase();
		let c = [];
		for (cmd of cmds) {
			if (cmd.groups && cmd.groups.find(v => v == lower)) {
				c.push(cmd);
			}
		}
		return c;
	}

	const parse_format = (format, splits) => {
		let resp = [];
		for (form of format) {
			switch (form) {
				case "longstring":
					resp.push(splits.join(" "));
					break;
				default:
					splits.splice(0, 1);
					break;
			}
		}
		return resp;
	}

	const command_parse = async (line) => {
		const given_prefix = line.substring(0, config.prefix.length);
		if (given_prefix != config.prefix) return command_invalid_fallback();

		const splits = line.split(" ");

		if (splits.length === 0) return command_invalid_fallback();

		const cmd = splits[0];
		let possible1 = get_commands_by_input(cmds, cmd)[0];
		let group = get_commands_by_group(cmd);

		let command;

		if (possible1) {
			splits.splice(0, 1);
			command = possible1;
		} else if (group) {
			const possible2 = get_commands_by_input(group, splits[1])[0];
			if (possible2) {
				splits.splice(0, 2);
				command = possible2;
			} else {
				return command_invalid_fallback();
			}
		} else {
			return command_invalid_fallback();
		}

		const args = parse_format(command.format.split("/"), splits);

		const response = await command.callback(core, ...args);

		if (response === "exit") cons.callback = null;
	};

	load_cmds(__dirname + "/cmds/");

	cons.callback = command_parse;
}
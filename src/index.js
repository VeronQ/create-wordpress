// Packages
const { Command } = require('@oclif/command');

// Source
const { cliArgs, cliFlags } = require('./cli');
const { description } = require('../package.json');
const init = require('./init');

class CreateWordpressCommand extends Command {
  async run() {
    const {
      args: { projectName },
      flags
    } = this.parse(CreateWordpressCommand);
    init(projectName, flags);
  }
}

CreateWordpressCommand.description = description;
CreateWordpressCommand.flags = cliFlags;
CreateWordpressCommand.args = cliArgs;

module.exports = CreateWordpressCommand;

// Packages
const {Command} = require('@oclif/command')

// Source
const {cliArgs, cliFlags} = require('./cli')
const {description} = require('../package.json')

class CreateWordpressCommand extends Command {
  async run() {
    const {
      args: {projectName},
      flags,
    } = this.parse(CreateWordpressCommand)
    await require('./init')(projectName, flags)
  }
}

CreateWordpressCommand.description = description
CreateWordpressCommand.flags = cliFlags
CreateWordpressCommand.args = cliArgs

module.exports = CreateWordpressCommand

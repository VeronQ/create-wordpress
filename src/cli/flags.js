const { flags } = require('@oclif/command');

module.exports = {
  version: flags.version({
    char: 'v'
  }),
  help: flags.help({
    char: 'h'
  }),
  force: flags.boolean({
    char: 'f',
    description: 'overwrite target directory if it exists'
  }),
  skip: flags.boolean({
    char: 's',
    description: 'skip database initialization'
  }),
  noIndex: flags.boolean({
    char: 'n',
    description: 'disable search engine indexing'
  }),
  usePreset: flags.boolean({
    char: 'u',
    description: 'use the last saved preset as default configuration'
  })
};

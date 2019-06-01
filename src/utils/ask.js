const fuzzy = require('fuzzy')
const inquirer = require('inquirer')
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

const {locales, themes, plugins} = require('../api')
const {trim} = require('./helpers')
const {
  DEFAULT_DB_USER,
  DEFAULT_DB_HOST,
  DEFAULT_DB_PREFIX,
  DEFAULT_SITE_EXTENSION,
  DEFAULT_SITE_PROTOCOL,
} = require('./types')

const search = (answers, input = '', api) => {
  return new Promise(resolve => {
    const result = fuzzy.filter(input, api)
    resolve(result.map(el => el.original))
  })
}

const validateInput = (input, name) => {
  const isValid = input !== ''
  return isValid || `${name} is required`
}

module.exports = (projectName, flags) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'dbName',
      message: 'Database name',
      default: () => projectName,
      validate: input => validateInput(input, 'Database name'),
      when: () => !flags.skip,
      filter: trim,
    },
    {
      type: 'input',
      name: 'dbUser',
      message: 'Database username',
      default: () => DEFAULT_DB_USER,
      validate: input => validateInput(input, 'Database username'),
      when: () => !flags.skip,
      filter: trim,
    },
    {
      type: 'password',
      name: 'dbPass',
      message: 'Database password',
      mask: '*',
      validate: input => validateInput(input, 'Database password'),
      when: () => !flags.skip,
    },
    {
      type: 'input',
      name: 'dbHost',
      message: 'Database host',
      default: () => DEFAULT_DB_HOST,
      validate: input => validateInput(input, 'Database host'),
      when: () => !flags.skip,
      filter: trim,
    },
    {
      type: 'input',
      name: 'dbPrefix',
      message: 'Database prefix',
      default: () => DEFAULT_DB_PREFIX,
      when: () => !flags.skip,
      filter: trim,
    },
    {
      type: 'input',
      name: 'siteUrl',
      message: 'Project URL',
      default: () => `${DEFAULT_SITE_PROTOCOL}://${projectName}.${DEFAULT_SITE_EXTENSION}`,
      filter: trim,
    },
    {
      type: 'input',
      name: 'email',
      message: 'Email',
      validate: input => validateInput(input, 'Email'),
      when: () => !flags.skip,
      filter: trim,
    },
    {
      type: 'autocomplete',
      name: 'locale',
      message: 'Core language',
      pageSize: 4,
      source: (answers, input) => search(answers, input, locales),
    },
    {
      type: 'checkbox-plus',
      name: 'plugins',
      message: 'Plugins',
      pageSize: 6,
      searchable: true,
      highlight: true,
      when: () => !flags.skip,
      source: (answers, input) => search(answers, input, plugins),
    },
    {
      type: 'checkbox-plus',
      name: 'themes',
      message: 'Themes',
      pageSize: 6,
      searchable: true,
      highlight: true,
      when: () => !flags.skip,
      source: (answers, input) => search(answers, input, themes),
    },
  ])
}

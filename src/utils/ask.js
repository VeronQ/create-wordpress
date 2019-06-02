const fuzzy = require('fuzzy')
const inquirer = require('inquirer')
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))

const {getPreset} = require('../store/preset')
const {locales, themes, plugins} = require('../api')
const {trim, arrayColumn} = require('./helpers')
const {
  DEFAULT_DB_USER,
  DEFAULT_DB_HOST,
  DEFAULT_DB_PREFIX,
  DEFAULT_SITE_EXTENSION,
  DEFAULT_SITE_PROTOCOL,
  PAGE_SIZE,
} = require('./types')

const namePlugins = arrayColumn(plugins, 0)
const nameThemes = arrayColumn(themes, 0)

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

module.exports.inqPreset = () => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'savePreset',
      message: 'Save this configuration as default preset for the next uses?',
    },
  ])
}

module.exports.inqConfig = (projectName, flags) => {
  const preset = flags.usePreset ? getPreset() : {}

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
      default: () => preset.dbUser || DEFAULT_DB_USER,
      validate: input => validateInput(input, 'Database username'),
      when: () => !flags.skip,
      filter: trim,
    },
    {
      type: 'password',
      name: 'dbPass',
      message: 'Database password',
      mask: '*',
      default: () => preset.dbPass || null,
      validate: input => validateInput(input, 'Database password'),
      when: () => !flags.skip,
    },
    {
      type: 'input',
      name: 'dbHost',
      message: 'Database host',
      default: () => preset.dbHost || DEFAULT_DB_HOST,
      validate: input => validateInput(input, 'Database host'),
      when: () => !flags.skip,
      filter: trim,
    },
    {
      type: 'input',
      name: 'dbPrefix',
      message: 'Database prefix',
      default: () => preset.dbPrefix || DEFAULT_DB_PREFIX,
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
      default: () => preset.email || null,
      validate: input => validateInput(input, 'Email'),
      when: () => !flags.skip,
      filter: trim,
    },
    {
      type: 'autocomplete',
      name: 'locale',
      message: 'Core language',
      pageSize: PAGE_SIZE,
      source: (answers, input) => search(answers, input, locales),
    },
    {
      type: 'checkbox-plus',
      name: 'plugins',
      message: 'Plugins',
      pageSize: PAGE_SIZE,
      searchable: true,
      highlight: true,
      default: () => preset.plugins || [],
      when: () => !flags.skip,
      source: (answers, input) => search(answers, input, namePlugins),
      filter: input => {
        return input.map(x => plugins[namePlugins.indexOf(x)][1])
      },
    },
    {
      type: 'checkbox-plus',
      name: 'themes',
      message: 'Themes',
      pageSize: PAGE_SIZE,
      searchable: true,
      highlight: true,
      default: () => preset.themes || [],
      when: () => !flags.skip,
      source: (answers, input) => search(answers, input, nameThemes),
      filter: input => {
        return input.map(x => themes[nameThemes.indexOf(x)][1])
      },
    },
  ])
}

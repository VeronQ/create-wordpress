// Packages
const fuzzy = require('fuzzy')
const inquirer = require('inquirer')
const type = require('../utils/types')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

// Source
const presetHandler = require('../store/preset')
const {locales} = require('../api')

// Helpers
const {trim, validateInput, validateEmail} = require('./helpers')
const {
  DEFAULT_DB_USER,
  DEFAULT_DB_HOST,
  DEFAULT_DB_PREFIX,
  DEFAULT_SITE_EXTENSION,
  DEFAULT_SITE_PROTOCOL,
  PAGE_SIZE,
} = require('./types')

// Search through api results
const search = (answers, input = '', api) => {
  return new Promise(resolve => {
    const result = fuzzy.filter(input, api)
    resolve(result.map(el => el.original))
  })
}

// Create-related questions
module.exports.inqCreate = () => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'ok',
      message: 'Generate project in current directory?',
    },
  ])
}

// Preset-related questions
module.exports.inqPreset = () => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'savePreset',
      default: false,
      message: 'Save this configuration as default preset for the next uses?',
    },
  ])
}

// Config-related questions
module.exports.inqConfig = (projectName, flags) => {
  const preset = flags.hasOwnProperty(type.FLAGS.PRESET) ? presetHandler.get() : {}
  let filteredLocales = [...locales]

  if (preset && preset.locale && locales.includes(preset.locale)) {
    // Move the default locale to the first position (as inquirer-autocomplete-prompt doesn't support 'default')
    filteredLocales = [
      preset.locale,
      ...filteredLocales.filter(item => item !== preset.locale),
    ]
  }

  return inquirer.prompt([
    {
      type: 'input',
      name: 'dbName',
      message: 'Database name',
      default: projectName,
      validate: input => validateInput(input, 'Database name'),
      filter: trim,
    },
    {
      type: 'input',
      name: 'dbUser',
      message: 'Database username',
      default: preset.dbUser || DEFAULT_DB_USER,
      validate: input => validateInput(input, 'Database username'),
      filter: trim,
    },
    {
      type: 'password',
      name: 'dbPass',
      message: 'Database password',
      mask: '*',
      default: preset.dbPass || null,
    },
    {
      type: 'input',
      name: 'dbHost',
      message: 'Database host',
      default: preset.dbHost || DEFAULT_DB_HOST,
      validate: input => validateInput(input, 'Database host'),
      filter: trim,
    },
    {
      type: 'input',
      name: 'dbPrefix',
      message: 'Database prefix',
      default: preset.dbPrefix || DEFAULT_DB_PREFIX,
      validate: input => validateInput(input, 'Database prefix'),
      filter: trim,
    },
    {
      type: 'input',
      name: 'siteUrl',
      message: 'Project URL',
      default: `${DEFAULT_SITE_PROTOCOL}://${projectName}.${DEFAULT_SITE_EXTENSION}`,
      validate: input => validateInput(input, 'Project URL'),
      filter: trim,
    },
    {
      type: 'input',
      name: 'email',
      message: 'Email',
      default: preset.email || null,
      validate: input => validateEmail(input) || `Email is invalid`,
      filter: trim,
    },
    {
      type: 'autocomplete',
      name: 'locale',
      message: 'Core language',
      pageSize: PAGE_SIZE,
      source: (answers, input) => search(answers, input, filteredLocales),
    },
  ])
}

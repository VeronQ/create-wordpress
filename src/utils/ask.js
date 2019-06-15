// Packages
const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

// Source
const presetHandler = require('../store/preset');
const { locales, themes, plugins } = require('../api');

// Helpers
const { trim, validateInput, transposeArray } = require('./helpers');
const {
  DEFAULT_DB_USER,
  DEFAULT_DB_HOST,
  DEFAULT_DB_PREFIX,
  DEFAULT_SITE_EXTENSION,
  DEFAULT_SITE_PROTOCOL,
  PAGE_SIZE
} = require('./types');

// Separate slug and name arrays
const [namePlugins, slugPlugins] = transposeArray(plugins);
const [nameThemes, slugThemes] = transposeArray(themes);

// Search through api results
const search = (answers, input = '', api) => {
  return new Promise(resolve => {
    const result = fuzzy.filter(input, api);
    resolve(result.map(el => el.original));
  });
};

const getSlugByName = (input, arr, reference) => {
  return input.map(x => arr[reference.indexOf(x)][1]);
};

const getNameBySlug = (input, arr, reference) => {
  return input.map(x => arr[reference.indexOf(x)][0]);
};

// Preset-related questions
module.exports.inqPreset = () => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'savePreset',
      message: 'Save this configuration as default preset for the next uses?'
    }
  ]);
};

// Create-related questions
module.exports.inqCreate = () => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'ok',
      message: 'Generate project in current directory?'
    }
  ]);
};

// Config-related questions
module.exports.inqConfig = (projectName, flags) => {
  const preset = flags.usePreset ? presetHandler.get() : {};
  const { skip } = flags;
  let filteredLocales = [...locales];

  if (preset && preset.locale && locales.includes(preset.locale)) {
    // Move the default locale to the first position (as inquirer-autocomplete-prompt doesn't support 'default')
    filteredLocales = [
      preset.locale,
      ...filteredLocales.filter(item => item !== preset.locale)
    ]
  }

  return inquirer.prompt([
    {
      type: 'input',
      name: 'dbName',
      message: 'Database name',
      when: !skip,
      default: projectName,
      validate: input => validateInput(input, 'Database name'),
      filter: trim
    },
    {
      type: 'input',
      name: 'dbUser',
      message: 'Database username',
      when: !skip,
      default: preset.dbUser || DEFAULT_DB_USER,
      validate: input => validateInput(input, 'Database username'),
      filter: trim
    },
    {
      type: 'password',
      name: 'dbPass',
      message: 'Database password',
      mask: '*',
      when: !skip,
      default: preset.dbPass || null,
      validate: input => validateInput(input, 'Database password')
    },
    {
      type: 'input',
      name: 'dbHost',
      message: 'Database host',
      when: !skip,
      default: preset.dbHost || DEFAULT_DB_HOST,
      validate: input => validateInput(input, 'Database host'),
      filter: trim
    },
    {
      type: 'input',
      name: 'dbPrefix',
      message: 'Database prefix',
      when: !skip,
      default: preset.dbPrefix || DEFAULT_DB_PREFIX,
      validate: input => validateInput(input, 'Database prefix'),
      filter: trim
    },
    {
      type: 'input',
      name: 'siteUrl',
      message: 'Project URL',
      default: `${DEFAULT_SITE_PROTOCOL}://${projectName}.${DEFAULT_SITE_EXTENSION}`,
      validate: input => validateInput(input, 'Project URL'),
      filter: trim
    },
    {
      type: 'input',
      name: 'email',
      message: 'Email',
      when: !skip,
      default: preset.email || null,
      validate: input => validateInput(input, 'Email'),
      filter: trim
    },
    {
      type: 'autocomplete',
      name: 'locale',
      message: 'Core language',
      pageSize: PAGE_SIZE,
      source: (answers, input) => search(answers, input, filteredLocales)
    },
    {
      type: 'checkbox-plus',
      name: 'plugins',
      message: 'Plugins',
      pageSize: PAGE_SIZE,
      searchable: true,
      highlight: true,
      when: !skip,
      default: () => getNameBySlug(preset.plugins || [], plugins, slugPlugins) || [],
      source: (answers, input) => search(answers, input, namePlugins),
      filter: input => getSlugByName(input, plugins, namePlugins)
    },
    {
      type: 'checkbox-plus',
      name: 'themes',
      message: 'Themes',
      pageSize: PAGE_SIZE,
      searchable: true,
      highlight: true,
      when: !skip,
      default: () => getNameBySlug(preset.themes || [], themes, slugThemes) || [],
      source: (answers, input) => search(answers, input, nameThemes),
      filter: input => getSlugByName(input, themes, nameThemes)
    }
  ]);
};

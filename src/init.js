// Native
const path = require('path')

// Packages
const fse = require('fs-extra')
const validateProjectName = require('validate-npm-package-name')
const {red, cyan, yellow, bold} = require('chalk')
const commandExists = require('command-exists-promise')
const hyperlinker = require('hyperlinker')

// Source
const {inqCreate} = require('./utils/ask')
const {version} = require('../package.json')

// Helpers
const {clearConsole} = require('./utils/helpers')

async function init(projectName, flags) {
  clearConsole()
  console.log(bold(`[create-wordpress v${version}]\n`))

  try {
    const exists = await commandExists('wp')
    if (!exists) {
      console.error(red('WP CLI is required'))
      console.log(hyperlinker(cyan('https://wp-cli.org/'), 'https://wp-cli.org/'))
      process.exit(1)
    }
  } catch (error) {
    console.error(red(error))
    process.exit(1)
  }

  const cwd = process.cwd()
  const inCurrent = (projectName === '.')
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  const result = validateProjectName(name)


  if (!result.validForNewPackages) {
    const log = [
      ...result.errors || [],
      ...result.warnings || [],
    ]
    console.error(red.bold(`Invalid project name: "${name}"`))
    console.error(red(`Error: ${log[0]}.\n`))
    process.exit(1)
  }

  if (fse.existsSync(targetDir)) {
    if (flags.hasOwnProperty('force') && !inCurrent) {
      await fse.remove(targetDir)
    } else if (inCurrent) {
      const {ok} = await inqCreate()
      if (!ok) {
        return
      }
      clearConsole()
    } else {
      console.error(red(`Target directory ${cyan(targetDir)} already exists.`))
      process.exit(1)
    }
  }

  if (!fse.existsSync(targetDir)) {
    fse.mkdirSync(name)
    process.chdir(name)
  }

  console.log(`Creating project in ${yellow(targetDir)}\n`)
  await require('./create')(name, flags)
}

module.exports = (...args) => {
  return init(...args).catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

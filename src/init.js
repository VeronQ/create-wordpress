const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const validateProjectName = require('validate-npm-package-name')
const {red, cyan, yellow} = require('chalk')
const create = require('./create')

async function init(projectName, flags) {
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
    console.error(red.bold(`\nInvalid project name: "${name}"`))
    if (log.length) {
      console.error(red(`Error: ${log[0]}.\n`))
    }
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
    if ('force' in flags && !inCurrent) {
      await fs.remove(targetDir)
    } else if (inCurrent) {
      const {ok} = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: 'Generate project in current directory?',
        },
      ])
      if (!ok) return
    } else {
      console.error(red(`\nTarget directory ${cyan(targetDir)} already exists.`))
      process.exit(1)
    }
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(name)
    process.chdir(name)
  }

  console.log(`\nCreating project in ${yellow(targetDir)}\n`)
  create(name, flags)
}

module.exports = (...args) => {
  return init(...args).catch(error => {
    console.error(error)
    process.exit(1)
  })
}

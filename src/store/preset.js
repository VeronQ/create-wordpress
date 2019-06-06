// Native
const fs = require('fs')
const path = require('path')

// Helpers
const {
  HOME_DIRECTORY,
  CONFIG_DIRECTORY,
  PRESET_FILE,
} = require('../utils/types')

const presetFile = path.join(HOME_DIRECTORY, CONFIG_DIRECTORY, PRESET_FILE)
const presetFileExists = fs.existsSync(path.dirname(presetFile))

const createPresetFile = () => fs.mkdirSync(path.dirname(presetFile))

module.exports.getPreset = () => {
  if (!presetFileExists) {
    return {}
  }
  return JSON.parse(fs.readFileSync(presetFile, {encoding: 'utf-8'}))
}

module.exports.setPreset = preset => {
  if (!presetFileExists) {
    createPresetFile()
  }
  const data = JSON.stringify(preset)
  fs.writeFileSync(presetFile, data, {encoding: 'utf-8'})
}

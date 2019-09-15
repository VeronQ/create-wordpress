// Native
const path = require('path')

// Packages
const fse = require('fs-extra')

// Helpers
const {
  HOME_DIRECTORY,
  CONFIG_DIRECTORY,
  PRESET_FILE_NAME,
} = require('../utils/types')

const presetFile = path.join(HOME_DIRECTORY, CONFIG_DIRECTORY,
  PRESET_FILE_NAME)
const presetFileExists = fse.existsSync(presetFile)

const createPresetFile = () => {
  return fse.createFileSync(presetFile)
}

const getPreset = () => {
  if (!presetFileExists) {
    return {}
  }
  return fse.readJsonSync(presetFile)
}

const setPreset = (data) => {
  if (!presetFileExists) {
    createPresetFile()
  }
  fse.writeJsonSync(presetFile, data)
}

module.exports = {
  get: getPreset,
  set: setPreset,
}

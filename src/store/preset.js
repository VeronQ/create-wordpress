// Native
const path = require('path');

// Packages
const fse = require('fs-extra');

// Helpers
const {
  HOME_DIRECTORY,
  CONFIG_DIRECTORY,
  PRESET_FILE_NAME
} = require('../utils/types');

const presetFile = path.join(HOME_DIRECTORY, CONFIG_DIRECTORY, PRESET_FILE_NAME);
const presetFileExists = fse.existsSync(presetFile);

const createPresetFile = () => {
  return fse.createFileSync(presetFile);
};

module.exports.getPreset = () => {
  if (!presetFileExists) {
    return {};
  }
  return fse.readJsonSync(presetFile);
};

module.exports.setPreset = (data) => {
  if (!presetFileExists) {
    createPresetFile();
  }
  fse.writeJsonSync(presetFile, data);
};

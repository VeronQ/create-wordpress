const {homedir} = require('os')

const DEFAULT_DB_USER = 'root'
const DEFAULT_DB_PASS = 'root'
const DEFAULT_DB_HOST = 'localhost'
const DEFAULT_DB_PREFIX = 'wp_'

const ADMIN_USER = 'admin'
const ADMIN_PASSWORD = 'admin'

const DEFAULT_SITE_EXTENSION = 'local'
const DEFAULT_SITE_PROTOCOL = 'http'

const ADMIN_PATH = 'wp-admin'

const WP_INSTALL_URI = 'https://make.wordpress.org/cli/handbook/installing/#recommended-installation'
const GIT_INSTALL_URI = 'https://git-scm.com/downloads'
const NPM_INSTALL_URI = 'https://www.npmjs.com/get-npm'

const HOME_DIRECTORY = homedir()
const CONFIG_DIRECTORY = 'create-wordpress'
const PRESET_FILE = 'preset.json'

const PAGE_SIZE = 4

module.exports = {
  DEFAULT_DB_USER,
  DEFAULT_DB_PASS,
  DEFAULT_DB_HOST,
  DEFAULT_DB_PREFIX,
  ADMIN_USER,
  ADMIN_PASSWORD,
  DEFAULT_SITE_EXTENSION,
  DEFAULT_SITE_PROTOCOL,
  ADMIN_PATH,
  WP_INSTALL_URI,
  GIT_INSTALL_URI,
  NPM_INSTALL_URI,
  HOME_DIRECTORY,
  CONFIG_DIRECTORY,
  PRESET_FILE,
  PAGE_SIZE
}

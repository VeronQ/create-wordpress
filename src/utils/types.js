const { homedir } = require('os');

const DEFAULT_DB_USER = 'root';
const DEFAULT_DB_PASS = 'root';
const DEFAULT_DB_HOST = 'localhost';
const DEFAULT_DB_PREFIX = 'wp_';

const DEFAULT_SITE_EXTENSION = 'local';
const DEFAULT_SITE_PROTOCOL = 'http';

const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'admin';
const ADMIN_PATH = 'wp-admin';

const HOME_DIRECTORY = homedir();
const CONFIG_DIRECTORY = 'create-wordpress';
const PRESET_FILE = 'preset.json';

const PAGE_SIZE = 4;

module.exports = {
  DEFAULT_DB_USER,
  DEFAULT_DB_PASS,
  DEFAULT_DB_HOST,
  DEFAULT_DB_PREFIX,
  DEFAULT_SITE_EXTENSION,
  DEFAULT_SITE_PROTOCOL,
  ADMIN_USER,
  ADMIN_PASSWORD,
  ADMIN_PATH,
  HOME_DIRECTORY,
  CONFIG_DIRECTORY,
  PRESET_FILE,
  PAGE_SIZE
};

// Packages
const Listr = require('listr');
const execa = require('execa');
const notifier = require('node-notifier');
const { cli } = require('cli-ux');
const { red, cyan, yellow, bold } = require('chalk');

// Source
const { setPreset } = require('./store/preset');
const { inqConfig, inqPreset } = require('./utils/ask');

// Helpers
const { capitalize, spacer } = require('./utils/helpers');
const type = require('./utils/types');

async function create(projectName, flags) {
  // Set a default value to undefined keys (if --skip flag)
  const settings = await inqConfig(projectName, flags);
  const {
    dbName = projectName,
    dbUser = type.DEFAULT_DB_USER,
    dbPass = type.DEFAULT_DB_PASS,
    dbHost = type.DEFAULT_DB_HOST,
    dbPrefix = type.DEFAULT_DB_PREFIX,
    locale,
    email,
    siteUrl,
    plugins = [],
    themes = []
  } = settings;

  const tasks = new Listr([
    {
      title: 'Download WordPress core',
      task: async () => {
        try {
          await execa.shell(`wp core download --locale=${locale}`);
        } catch (error) {
          throw new Error(error.stderr);
        }
      }
    },
    {
      title: 'Generate wp-config.php',
      task: async () => {
        const check = ('skip' in flags ? '--skip-check' : '');
        try {
          await execa.shell(`wp config create --dbname=${dbName} --dbuser=${dbUser} --dbpass=${dbPass} --dbhost=${dbHost} --dbprefix=${dbPrefix} ${check}`);
        } catch (error) {
          throw new Error(error.stderr);
        }
        execa.shell('wp config set WP_DEBUG true --raw');
      }
    },
    {
      title: 'Create database',
      enabled: () => !flags.skip,
      task: async () => {
        const siteTitle = capitalize(projectName);
        return new Listr([
          {
            title: 'Initialize database',
            task: async () => {
              try {
                await execa.shell('wp db create');
              } catch (error) {
                throw new Error(error.stderr);
              }
            }
          },
          {
            title: 'Generate tables',
            task: async () => {
              try {
                await execa.shell(`wp core install --admin_user=${type.ADMIN_USER} --admin_password=${type.ADMIN_PASSWORD} --admin_email=${email} --url=${siteUrl} --title=${siteTitle} --skip-email`);
              } catch (error) {
                throw new Error(error.stderr);
              }
            }
          },
          {
            title: 'Disable search engine indexing',
            enabled: () => flags.noIndex,
            task: async () => {
              try {
                await execa.shell('wp option set blog_public 0');
              } catch (error) {
                throw new Error(error.stderr);
              }
            }
          }
        ]);
      }
    },
    {
      title: 'Download plugins',
      enabled: () => !flags.skip,
      skip: async () => {
        if (!plugins.length) {
          return 'No plugin selected';
        }
      },
      task: async () => {
        try {
          await execa.shell(`wp plugin install ${plugins.join(' ')}`);
        } catch (error) {
          throw new Error(error.stderr);
        }
      }
    },
    {
      title: 'Download themes',
      enabled: () => !flags.skip,
      skip: async () => {
        if (!themes.length) {
          return 'No theme selected';
        }
      },
      task: async () => {
        try {
          await execa.shell(`wp theme install ${themes.join(' ')}`);
        } catch (error) {
          throw new Error(error.stderr);
        }
      }
    }
  ]);

  spacer();

  try {
    await tasks.run().then(() => {
      console.log(`\n🎉 Successfully created project ${yellow(projectName)}.\n`);
      notifier.notify({
        title: 'create-wordpress',
        message: `🎉 Successfully created project ${projectName}.`
      });
      if (!flags.skip) {
        const adminUrl = [siteUrl, type.ADMIN_PATH].join('/');
        cli.url(cyan(adminUrl), adminUrl);
        console.log(`\nUsername: ${bold(type.ADMIN_USER)}`);
        console.log(`Password: ${bold(type.ADMIN_PASSWORD)}\n`);
      }

      (async () => {
        const { savePreset } = await inqPreset();
        if (savePreset) {
          setPreset(settings);
          console.log(cyan('\nPreset saved, use "--usePreset (alias: -u)" next time.'));
        }
        spacer();
        process.exit();
      })();
    });
  } catch (error) {
    console.error(red('\nSomething went wrong'));
    console.log(error);
    process.exit(1);
  }
}

module.exports = (...args) => {
  return create(...args).catch(error => {
    console.error(error);
    process.exit(1);
  });
};

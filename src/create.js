// Packages
const Listr = require('listr')
const execa = require('execa')
const notifier = require('node-notifier')
const hyperlinker = require('hyperlinker')
const {red, cyan, yellow, bold} = require('chalk')

// Source
const presetHandler = require('./store/preset')
const {inqConfig, inqPreset} = require('./utils/ask')

// Helpers
const {capitalize, spacer} = require('./utils/helpers')
const type = require('./utils/types')

async function create(projectName, flags) {
  const settings = await inqConfig(projectName, flags)
  const {
    dbName = projectName,
    dbUser = type.DEFAULT_DB_USER,
    dbPass = type.DEFAULT_DB_PASS,
    dbHost = type.DEFAULT_DB_HOST,
    dbPrefix = type.DEFAULT_DB_PREFIX,
    locale,
    email,
    siteUrl,
  } = settings

  const tasks = new Listr([
    {
      title: 'Download WordPress core',
      task: async () => {
        try {
          await execa('wp', ['core', 'download', `--locale=${locale}`])
        } catch (error) {
          throw new Error(error)
        }
      },
    },
    {
      title: 'Generate wp-config.php',
      task: async () => {
        try {
          await execa('wp',
            [
              'config',
              'create',
              `--dbname=${dbName}`,
              `--dbuser=${dbUser}`,
              `--dbpass=${dbPass}`,
              `--dbhost=${dbHost}`,
              `--dbprefix=${dbPrefix}`,
            ],
          )
        } catch (error) {
          throw new Error(error)
        }
        execa('wp', ['config', 'set', 'WP_DEBUG', true, '--raw'])
      },
    },
    {
      title: 'Create database',
      task: async () => {
        const siteTitle = capitalize(projectName)
        return new Listr([
          {
            title: 'Initialize database',
            task: async () => {
              try {
                await execa('wp', ['db', 'create'])
              } catch (error) {
                throw new Error(error)
              }
            },
          },
          {
            title: 'Generate tables',
            task: async () => {
              try {
                await execa('wp',
                  [
                    'core',
                    'install',
                    `--admin_user=${type.ADMIN_USER}`,
                    `--admin_password=${type.ADMIN_PASSWORD}`,
                    `--admin_email=${email}`,
                    `--url=${siteUrl}`,
                    `--title=${siteTitle}`,
                    `--skip-email`,
                  ],
                )
              } catch (error) {
                throw new Error(error)
              }
            },
          },
          {
            title: 'Disable search engine indexing',
            enabled: () => flags.hasOwnProperty(type.FLAGS.NOINDEX),
            task: async () => {
              try {
                await execa('wp',
                  [
                    'option',
                    'set',
                    'blog_public',
                    0,
                  ])
              } catch (error) {
                throw new Error(error)
              }
            },
          },
        ])
      },
    },
  ])

  spacer()

  try {
    await tasks.run().then(() => {
      console.log(`\n🎉 Successfully created project ${yellow(projectName)}.\n`)
      notifier.notify({
        title: 'create-wordpress',
        message: `🎉 Successfully created project ${projectName}.`,
      })
      const adminUrl = [siteUrl, type.ADMIN_PATH].join('/')
      console.log(hyperlinker(cyan(adminUrl), adminUrl))
      console.log(`\nUsername: ${bold(type.ADMIN_USER)}`)
      console.log(`Password: ${bold(type.ADMIN_PASSWORD)}\n`)

      ;(async () => {
        const {savePreset} = await inqPreset()
        if (savePreset) {
          presetHandler.set(settings)
          console.log(cyan('\nPreset saved, use "--preset (alias: -p)" next time.'))
        }
        spacer()
        process.exit()
      })()
    })
  } catch ({message}) {
    console.log(red('\nSomething went wrong'))
    console.error(message)
    process.exit(1)
  }
}

module.exports = (...args) => {
  return create(...args).catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

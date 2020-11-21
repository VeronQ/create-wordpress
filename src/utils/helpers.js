const readline = require('readline')

/**
 * First letter Uppercase
 *
 * @param str
 * @returns {string}
 */
const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Empty log
 *
 * @param counter
 */
const spacer = (counter = 1) => {
  for (let i = 0; i < counter; i++) {
    console.log('')
  }
}

/**
 * Remove white spaces
 *
 * @param input
 * @returns {string | StringChain}
 */
const trim = (input) => {
  return input.trim()
}

/**
 * Transpose multi dimensional arrays
 *
 * @param array
 * @returns {*}
 */
const transposeArray = (array) => {
  return array[0].map((col, i) => {
    return array.map(row => row[i])
  })
}

/**
 * Check if input is not empty
 *
 * @param input
 * @param name
 * @returns {boolean|string}
 */
const validateInput = (input, name) => {
  return input !== '' || `${name} is required`
}

/**
 * E-mail syntax validation
 *
 * @param input
 * @returns {boolean}
 */
const validateEmail = (input) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(input).toLowerCase())
}

/**
 * Clear console
 */
const clearConsole = () => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }
}

module.exports = {
  capitalize,
  spacer,
  trim,
  validateInput,
  validateEmail,
  transposeArray,
  clearConsole,
}

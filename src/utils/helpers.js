// First letter Uppercase
const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Empty log
const spacer = (counter = 1) => {
  for (let i = 0; i < counter; i++) {
    console.log('')
  }
}

// Remove white spaces
const trim = input => {
  return input.trim()
}

// Return specific column from an Array
const arrayColumn = (arr, n) => {
  return arr.map(x => x[n])
}

// Check if input is not empty
const validateInput = (input, name) => {
  return input !== '' || `${name} is required`
}

module.exports = {
  capitalize,
  spacer,
  trim,
  arrayColumn,
  validateInput,
}

const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const spacer = (counter = 1) => {
  for (let i = 0; i < counter; i++) {
    console.log('')
  }
}

module.exports = {
  capitalize,
  spacer,
}

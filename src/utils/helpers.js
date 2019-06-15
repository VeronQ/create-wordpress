// First letter Uppercase
const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Empty log
const spacer = (counter = 1) => {
  for (let i = 0; i < counter; i++) {
    console.log('');
  }
};

// Remove white spaces
const trim = (input) => {
  return input.trim();
};

// Transpose multi dimensional arrays
const transposeArray = (array) => {
  return array[0].map((col, i) => {
    return array.map(row => row[i]);
  });
};

// Check if input is not empty
const validateInput = (input, name) => {
  return input !== '' || `${name} is required`;
};

module.exports = {
  capitalize,
  spacer,
  trim,
  validateInput,
  transposeArray
};

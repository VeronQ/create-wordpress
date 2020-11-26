# create-wordpress

> WordPress automated installation

[![npm version](https://badge.fury.io/js/create-wordpress.svg)](https://npmjs.org/package/create-wordpress "View this project on npm")
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/VeronQ/create-wordpress/blob/master/LICENSE)

![Demo CLI](../assets/demo.gif?raw=true)

## Requirements

* `Node.js` >= 8.0.0

## Installation

```sh
$ npm install -g create-wordpress
```

## Usage

```
$ create-wordpress --help

  Usage: create-wordpress <projectName> [options]
  
  WordPress automated installation
  
  Options:
    -f, --force    overwrite target directory if it exists
    -h, --help     show CLI help
    -n, --noIndex  disable search engine indexing
    -p, --preset   use the last saved preset as default configuration
    -s, --skip     skip database initialization
    -v, --version  show CLI version
```

## Example

**Initliaze project and disable search engine indexing**

```sh
$ create-wordpress my-app --noIndex
```

## License

The Wordpress create-wordpress CLI is open-sourced software licensed under the [MIT](https://github.com/VeronQ/create-wordpress/blob/master/LICENSE).

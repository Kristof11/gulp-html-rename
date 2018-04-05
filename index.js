const PluginError = require('plugin-error')
const through = require('through2')

const PLUGIN_NAME = 'gulp-html-rename'

const ABC = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

/**
 * Get the next mapping depending on the current one, the alphabet and a
 * separator.
 * @param {Array<Number>} current The current mapping.
 * @param {Array<string>} alphabet The alphabet to choose from.
 * @param {string} separator The separator to inject inside the mapping.
 * @returns {string} The mapping.
 */
const getMapping = (current, alphabet, separator) => {
  current[4]++
  if (current[4] >= alphabet.length) {
    current[3]++
    current[4] = 0
  }
  if (current[3] >= alphabet.length) {
    current[2]++
    current[3] = 0
  }
  if (current[2] >= alphabet.length) {
    current[1]++
    current[2] = 0
  }
  if (current[1] >= alphabet.length) {
    current[0]++
    current[1] = 0
  }

  return alphabet[current[0]] + separator + alphabet[current[1]] +
    alphabet[current[2]] + alphabet[current[3]] + alphabet[current[4]]
};

const getIdMapping = function() {
  return getMapping(htmlRename.cache['id'], ABC, '')
};

const getLongIdMapping = function() {
  return getMapping(htmlRename.cache['long-id'], ABC, '-')
};

const getClassMapping = function() {
  return getMapping(htmlRename.cache['class'], ABC, '')
};

/**
 * Replace all occurrences of pattern inside the f at place i with the mapping
 * returned by mapper.
 * @param {string} f
 * @param {Number} i
 * @param {string} pattern
 * @param {function} mapper
 * @returns {string}
 */
const replace = (f, i, pattern, mapper) => {
  if (f.substr(i, pattern.length) === pattern) {
    let j = 1
    while (f[i + j] !== '\"' && f[i + j] !== '\'' && f[i + j] !== '>' &&
    f[i + j] !== ' ' && f[i + j] !== ')' && f[i + j] !== '{' && f[i + j] !== ':') {
      j++
    }

    const map = mapper()
    const regex = f.substr(i, j)

    htmlRename.map.push({'name': regex, 'map': map})

    f = f.replace(new RegExp(regex + '(?!-)', 'g'), map)
  }

  return f
}

/**
 * Rename all ids and classes to shorter names.
 * @param file The files to rename.
 * @param allowedExtensions
 * @returns {*}
 */
const rename = (file, allowedExtensions) => {
  allowedExtensions = allowedExtensions.join('|')
  const extensionRegex = new RegExp('.(html|css|js|' + allowedExtensions + ')', 'i')
  if (!String(file.history).match(extensionRegex)){
    return file
  }

  let i = 0

  if (file.isStream()) {
    this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'))
  }

  if (file.isBuffer()) {
    let f = file.contents.toString('utf-8')

    let k = 0;
    while (k < htmlRename.map.length) {
      f = f.replace(new RegExp(htmlRename.map[k].name + '(?!-)', 'g'),
        htmlRename.map[k].map)
      k++
    }

    while (i < f.length) {
      // Basic ids and classes.
      f = replace(f, i, 'id-', getIdMapping)
      f = replace(f, i, 'class-', getClassMapping)

      // Support for Polymer ids.
      f = replace(f, i, 'iron-', getLongIdMapping)
      f = replace(f, i, 'paper-', getLongIdMapping)
      f = replace(f, i, 'neon-', getLongIdMapping)
      f = replace(f, i, 'platinum-', getLongIdMapping)

      let j = 0;
      while (j < customPrefix.length) {
        f = replace(f, i, customPrefix[j], getLongIdMapping)
        j++
      }

      i++
    }

    file.contents = new Buffer(f)
  }

  return file
};

let customPrefix = []

/**
 * @param options Array of prefixes.
 * Prefix is the prefix of the words that should be shortened.
 * @param allowedExtensions
 */
htmlRename = function(options, allowedExtensions) {
  if (options != null) {
    customPrefix = options
  }

  return through.obj(function(file, encoding, callback) {
    callback(null, rename(file, allowedExtensions))
  });
};

htmlRename.cache = {
  'id': [1, 0, 0, 0, 0],
  'long-id': [1, 0, 0, 0, 0],
  'class': [1, 0, 0, 0, 0]
};

htmlRename.map = []

module.exports = htmlRename

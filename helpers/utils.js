/*
  Name: utils.js
  Author: Trent Brew (https://github.com/trentbrew)
  Last edited: 05/12/2023
  Description: This file contains a collection of global helper functions.
*/

const utils = {
  // This function sorts a 2d array by a given index

  sort2d: (arr, index) => arr.sort((a, b) => a[index] - b[index]),

  // This function will return a random number between min and max (both included):

  random: (min, max) => Math.floor(Math.random() * (max - min + min)),

  // This function takes an array and makes it's values unique

  unique: arr => Array.from(new Set(arr)),

  // This function takes an array of objects and returns an array of unique values of a given key

  uniqueKeys: (arr, key) => {
    var flags = [],
      output = [],
      l = arr.length,
      i
    for (i = 0; i < l; i++) {
      if (flags[arr[i][key]]) continue
      flags[arr[i][key]] = true
      output.push(arr[i][key])
    }
    return output
  },

  // This function takes a timestamp and returns a formatted time string

  timeString: (timestamp, style) => {
    return new Date(timestamp).toLocaleTimeString('en', {
      timeStyle: style || 'long',
      hour12: true,
      timeZone: 'UTC',
    })
  },

  // This function takes a timestamp and returns a formatted date string

  dateString: (timestamp, style) => {
    const date = new Date(timestamp)
    const options = { month: style || 'long', day: 'numeric', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  },

  // This function returns the difference between two timestamps in the specified unit

  timeDifference: (timestamp1, timestamp2, unit) => {
    if (unit === 'ms') return Math.abs(timestamp1 - timestamp2)
    else if (unit === 's') return Math.abs((timestamp1 - timestamp2) / 1000)
    else if (unit === 'm')
      return Math.abs((timestamp1 - timestamp2) / 1000 / 60)
    else if (unit === 'h')
      return Math.abs((timestamp1 - timestamp2) / 1000 / 60 / 60)
    else if (unit === 'd')
      return Math.abs((timestamp1 - timestamp2) / 1000 / 60 / 60 / 24)
    else return Math.abs(timestamp1 - timestamp2)
  },

  // This function capitalizes the first letter of a string

  capitalize: str => str.charAt(0).toUpperCase() + str.slice(1),

  // This function takes a string and returns a slug (e.g. "Hello World" => "hello-world")

  slugify: str => {
    return str
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  },

  // This function does the opposite of slugify (e.g. "hello-world" => "Hello World")

  unslugify: str => {
    return str
      .split('-')
      .map(word => utils.capitalize(word))
      .join(' ')
  },

  // This function updates a specified object inside of an array based on the object's id

  patchJson: (json, payload) => {
    const index = json.findIndex(item => item.name === payload.name)
    let arr = json
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name === payload.name) {
        console.log('arr[i]: ', arr[i])
        arr[i] = payload
      }
    }
    return arr
  },
}

export default utils

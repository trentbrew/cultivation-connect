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
      i;
    for (i = 0; i < l; i++) {
      if (flags[arr[i][key]]) continue;
      flags[arr[i][key]] = true;
      output.push(arr[i][key]);
    }
    return output;
  },

  // This function takes a timestamp and returns a formatted time string

  timeString: (timestamp, style) => {
    return new Date(timestamp).toLocaleTimeString('en', {
      timeStyle: style || 'long',
      hour12: true,
      timeZone: 'UTC',
    });
  },

  // This function takes a timestamp and returns a formatted date string

  dateString: (timestamp, style) => {
    const date = new Date(timestamp);
    const options = { month: style || 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  },

  // This function returns the difference between two timestamps in the specified unit

  timeDifference: (timestamp1, timestamp2, unit) => {
    if (unit === 'ms') return Math.abs(timestamp1 - timestamp2);
    else if (unit === 's') return Math.abs((timestamp1 - timestamp2) / 1000);
    else if (unit === 'm')
      return Math.abs((timestamp1 - timestamp2) / 1000 / 60);
    else if (unit === 'h')
      return Math.abs((timestamp1 - timestamp2) / 1000 / 60 / 60);
    else if (unit === 'd')
      return Math.abs((timestamp1 - timestamp2) / 1000 / 60 / 60 / 24);
    else return Math.abs(timestamp1 - timestamp2);
  },

  // This function capitalizes the first letter of a string

  capitalize: str => str.charAt(0).toUpperCase() + str.slice(1),

  // This function takes a CSV file from user input and returns it's contents as a string

  readCsv: file => {
    console.log('reading csv...');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },

  // This function takes an ugly CSV and makes it pretty

  parseCsv: async csv => {
    console.clear();
    console.log('parsing CSV...');
    const lines = csv.split('\n').map(line => line.trim());
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const entry = {
        zone: headers[0], // Assuming the zone information is constant for all entries
        port: headers[1], // Assuming the port information is constant for all entries
        timestamp: values[0],
        soil_moist: values[4],
        soil_temp: values[2],
        pore_ec: values[3],
      };
      data.push(entry);
    }

    return data;
  },

  // csvToJson: csv => {
  //   console.log('converting csv to json...');
  //   const lines = csv.split('\n');
  //   const result = [];
  //   const headers = lines[0].split(',');
  //   for (let i = 1; i < lines.length; i++) {
  //     const obj = {};
  //     const currentline = lines[i].split(',');
  //     for (let j = 0; j < headers.length; j++) {
  //       obj[headers[j]] = currentline[j];
  //     }
  //     result.push(obj);
  //   }
  //   return result;
  // },
};

export default utils;

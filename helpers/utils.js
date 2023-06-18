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
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },

  // This function takes an ugly CSV and makes it pretty

  parseAroyaData: async csv => {
    const stretch = arr => {
      let result = [];
      arr.forEach((item, index) => {
        if (index > 0) {
          result.push(item);
          if (!arr[index + 1]) arr[index + 1] = item;
        }
      });
      return result;
    };

    const homogenize = headers => {
      let result = [];
      headers.forEach(header => {
        if (header == '% Water Content' || header == 'soil_moist') {
          result.push('soil_moist');
        }
        if (header == ' °F Soil Temperature') {
          result.push('soil_temp');
        }
        if (header == ' mS/cm Pore Water EC') {
          result.push('pore_ec');
        }
      });
      return result;
    };

    const namify = str => {
      const common = [
        'soil_moist',
        '% Water Content',
        '°F Soil Temperature',
        'mS/cm Pore Water EC',
      ];
      if (common.includes(str)) {
        if (str == '% Water Content') return 'soil_moisture';
        if (str == '°F Soil Temperature') return 'grow_medium_temp';
        if (str == 'mS/cm Pore Water EC') return 'pore_ec';
      } else {
        return str.toLowerCase().replaceAll(' ', '_');
      }
    };

    const lines = csv.split('\n').map(line => line.trim());

    const growth_stages = stretch(lines[0].split(','));
    const zones = stretch(lines[1].split(','));
    const ports = stretch(lines[2].split(','));
    const sensors = stretch(lines[3].split(','));
    const rawHeaders = stretch(lines[4].split(','));
    const headers = homogenize(stretch(lines[4].split(',')));

    const data = [];

    // ports.forEach((port, portIndex) => {
    //   let entry = {};
    //   let readings = [];
    //   lines.forEach((line, lineIndex) => {
    //     const timestamp = line.split(',')[0];
    //     if (lineIndex > 4) {
    //       line.split(',').forEach((item, itemIndex) => {
    //         if (itemIndex == portIndex && item != timestamp) {
    //           readings.push({
    //             [headers[itemIndex]]: item,
    //             timestamp,
    //           });
    //         }
    //       });
    //     }
    //   });
    //   entry = {
    //     ...entry,
    //     port,
    //     zone: zones[portIndex],
    //     sensor: sensors[portIndex],
    //     growth_stage: growth_stages[portIndex],
    //     readings,
    //   };
    //   data.push(entry);
    // });

    // Note to self: each zone is it's own cycle

    zones.forEach((zone, zoneIndex) => {
      let prospective_cycles = [];
      ports.forEach((port, portIndex) => {
        let entries = [];
        if (portIndex == zoneIndex) {
          lines.forEach((line, lineIndex) => {
            if (lineIndex > 4) {
              const vals = line.split(',');
              let record = [];
              vals.forEach((value, valueIndex) => {
                if (valueIndex > 0 && valueIndex == portIndex) {
                  // console.log(headers);
                  // console.log(valueIndex);
                  record.push({
                    ...record,
                    label: rawHeaders[valueIndex],
                    name: headers[valueIndex],
                    value,
                  });
                }
              });
              entries.push({
                entry_id: `${vals[0]}_${zone}_${growth_stages[portIndex]}_${port}`,
                timestamp: vals[0],
                port,
                zone,
                sensor: sensors[portIndex],
                growth_stage: growth_stages[portIndex],
                data: record,
                // recorded_by (fill @ [cycle].vue)
                // facility (fill @ [cycle].vue)
                // cycle (fill @ [cycle].vue)
                // cultivar (fill @ [cycle].vue)
                // cycle_day (fill @ [cycle].vue)
                // cycle_week (fill @ [cycle].vue)
                // room (fill @ [cycle].vue)
              });
            }
          });
          prospective_cycles.push({
            nickname: `${zone}_${growth_stages[portIndex]}`,
            zone,
            growth_stage: growth_stages[portIndex],
            entries,
          });
        }
      });
      data.push(prospective_cycles);
    });

    console.log('final data: ', data.flat());

    return {
      data,
      // entries: data.flat(),
    };
  },
};

export default utils;

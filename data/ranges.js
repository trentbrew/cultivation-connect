/*
  Name: ranges.js
  Author: Trent Brew (https://github.com/trentbrew)
  Last edited: 05/17/2023
  Description:
    This file contains the ranges for each sensor type. These ranges are used to determine the state of the user's growth cycle and the color of the sensor value in the UI.
*/

const ranges = [
  /*

    {
      name: String,
        // `name` is the unique id of the sensor type.
        // ⛔️ Do not change this value. It is used to reference the sensor type in the UI.

      title: String,
        // `title` is the title of the sensor type. This is displayed in the UI.

      relative_min: Integer,
        // `relative_min` is the lowest realistic value and will be set as the gauge's minimum.

      relative_max: Integer,
        // `relative_max` is the highest realistic value and will be set as the gauge's maximum.

      min: Integer Array,
        // `min` is the threshold for a reading that is too low. If the sensor reading is below this value minus `margin`, the gauge will be red.
        // Each index of the array corresponds to one of 6 growth stages. For example, if the sensor type is `air_temp`, the first index of the array is the minimum value for the `seedling` stage, the second index is the minimum value for the `vegetative` stage, and so on. This applies to `min`, `median`, `max`, and `margin`.

      median: Integer Array,
        // `median` is the optimal value for the sensor type. If the sensor reading is between the `min` and `median` values, the gauge will be green.

      max: Integer Array,
        // `max` is the threshold for a reading that is too high. If the sensor reading is above the sum of `max` and 'margin', the gauge will be red.

      margin: Integer Array,
        // `margin` is the range of values that are considered to be acceptable. If the sensor reading is greater than or equal to `min - margin`, or the reading is less than or equal to `max + margin`, the gauge will be yellow.

      unit: String,
        // `unit` is the unit of measurement for the sensor type. This is displayed in the UI.
    },

  */

  {
    name: 'air_temp',
    title: 'Air Temperature',
    relative_min: 20,
    relative_max: 140,
    min: [50],
    median: [81.5],
    max: [113],
    margin: [10],
    unit: '°F',
  },
  {
    name: 'air_humidity',
    title: 'Air Humidity',
    relative_min: 0,
    relative_max: 1,
    min: [0.11],
    median: [0.55],
    max: [0.91],
    margin: [0.05],
    unit: '%',
  },
  {
    name: 'solar',
    title: 'Solar PPFD',
    relative_min: 150,
    relative_max: 400,
    min: [225, 600],
    median: [250, 850],
    max: [275, 1150],
    margin: [50, 50],
    unit: 'W/m²',
  },
  {
    name: 'vpd',
    title: 'Vapor Pressure Deficit',
    relative_min: 0,
    relative_max: 1,
    min: [0.6],
    median: [0.7],
    max: [0.8],
    margin: [0.15],
    unit: 'kPa',
  },
  {
    name: 'dli',
    title: 'Daylight Integral',
    relative_min: -20,
    relative_max: 80,
    min: [21],
    median: [33.5],
    max: [46],
    margin: [26],
    unit: '', // µmol/m²/s ?
  },
  {
    name: 'co2',
    title: 'CO2',
    relative_min: 500,
    relative_max: 2500,
    min: [1100],
    median: [1300],
    max: [1500],
    margin: [200],
    unit: 'ppm',
  },
  {
    name: 'pore_ec',
    title: 'Pore EC',
    relative_min: 0,
    relative_max: 1,
    min: [0.1],
    median: [0.45],
    max: [0.8],
    margin: [0.05],
    unit: '%',
  },
  {
    name: 'day_time_pore_ec',
    title: 'Pore EC (Day)',
    relative_min: 0,
    relative_max: 1,
    min: [0.1],
    median: [0.175],
    max: [0.25],
    margin: [0.05],
    unit: '%',
  },
  {
    name: 'day_time_soil_moisture',
    title: 'Soil Moisture (Day)',
    relative_min: 0.1,
    relative_max: 0.75,
    min: [0.44],
    median: [0.47],
    max: [0.5],
    margin: [0.06],
    unit: '%',
  },
  {
    name: 'day_time_dry_back',
    title: 'Dry Back (Day)',
    relative_min: 0,
    relative_max: 0.2,
    min: [0.05],
    median: [0.075],
    max: [0.1],
    margin: [0.049],
    unit: '%',
  },
  {
    name: 'night_time_pore_ec',
    title: 'Pore EC (Night)',
    relative_min: 0,
    relative_max: 0.02,
    min: [0.01],
    median: [0.05],
    max: [0.1],
    margin: [0.01],
    unit: '%',
  },
  {
    name: 'night_time_soil_moisture',
    title: 'Soil Moisture (Night)',
    relative_min: 0.1,
    relative_max: 0.75,
    min: [0.31],
    median: [0.4],
    max: [0.49],
    margin: [0.05],
    unit: '%',
  },
  {
    name: 'night_time_dry_back',
    title: 'Dry Back (Night)',
    relative_min: 0,
    relative_max: 0.6,
    min: [0, 0.3],
    median: [0.175, 0.35],
    max: [0.35, 0.4],
    margin: [0.1, 0.1],
    unit: '%',
  },
  {
    name: 'grow_medium_temp',
    title: 'Soil Temperature',
    relative_min: 40,
    relative_max: 90,
    min: [60],
    median: [68],
    max: [76],
    margin: [4],
    unit: '°F',
  },
  {
    name: 'ph',
    title: 'pH',
    relative_min: 5,
    relative_max: 7,
    min: [5.8],
    median: [6.0],
    max: [6.2],
    margin: [0.3],
    unit: '',
  },
  {
    name: 'yield',
    title: 'Yield',
    relative_min: 0,
    relative_max: 1000,
    min: [60],
    median: [999],
    max: [1000],
    margin: [20],
    unit: 'g/sqft',
  },
]

export default ranges

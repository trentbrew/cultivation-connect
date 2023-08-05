const header_map = {
  // ['Timestamp', 'Temperature', 'Air Humidity', 'Solar', 'VPD', 'DLI', 'CO2', 'PORE EC', 'Day Time PORE EC', 'Day Time Soil Moisture', 'Day Time Dry Break', 'Night Time PORE EC', 'Night Time Soil Moisture', 'Night Time Dry Back', 'Grow Medium Temp', 'pH']
  Timestamp: 'timestamp',
  Temperature: 'air_temp',
  'Air Humidity': 'air_humidity',
  Solar: 'solar',
  VPD: 'vpd',
  DLI: 'dli',
  CO2: 'co2',
  'PORE EC': 'pore_ec',
  'Day Time PORE EC': 'day_time_pore_ec',
  'Day Time Soil Moisture': 'day_time_soil_moisture',
  'Day Time Dry Break': 'day_time_dry_back',
  'Night Time PORE EC': 'night_time_pore_ec',
  'Night Time Soil Moisture': 'night_time_soil_moisture',
  'Night Time Dry Back': 'night_time_dry_back',
  'Grow Medium Temp': 'grow_medium_temp',
  pH: 'ph',
}

function parse(csv) {
  const lines = csv
    .split('\n')
    .map(line => line.trim())
    .slice(4, 25) // TODO: open the floodgates
  const headers = lines[0].split(',').map(header => header_map[header])
  let entries = []
  lines.splice(0).forEach(datum => {
    let data = {}
    const values = datum.split(',')
    values.forEach((value, index) => {
      data[headers[index]] = value
    })
    entries.push(data)
  })
  return entries
}

export default defineEventHandler(async event => {
  const body = await readBody(event)
  return parse(body)
})

const header_map = {
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

let entries = []

function parse(csv) {
  console.log('parsing csv')
  const lines = csv
    .split('\n')
    .map(line => line.trim())
    .slice(4, 6105) // TODO: LEAVE THE SLICE
  const headers = lines[0].split(',').map(header => header_map[header])
  console.log('headers', headers)
  lines.slice(1).forEach(datum => {
    let data = {}
    const values = datum.split(',')
    values.forEach((value, index) => {
      data[headers[index]] = value
    })
    console.log('data', data)
    entries.push(data)
  })

  const report = data => {
    return {
      start_date: data.timestamp,
      zone: '',
      growth_stage: '',
      entries: data.length,
      data,
      origin: 'mock',
    }
  }

  console.log('report', report(entries))

  const payload = {
    entry_count: entries.length,
    report: report(entries),
    data: entries,
  }

  console.log('payload', payload)

  return payload
}

export default defineEventHandler(async event => {
  const body = await readBody(event)
  return parse(body)
})

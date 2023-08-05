import ranges from '@/data/ranges'

function parse(csv) {
  const stretch = arr => {
    let result = []
    arr.forEach((item, index) => {
      if (index > 0) {
        result.push(item)
        if (!arr[index + 1]) arr[index + 1] = item
      }
    })
    return result
  }

  const lines = csv.split('\n').map(line => line.trim())
  const growth_stages = stretch(lines[4].split(','))
  const zones = stretch(lines[5].split(','))
  const rawHeaders = stretch(lines[8].split(','))

  const data = []

  const timeOfDay = timestamp => {
    const hour = new Date(timestamp).getHours()
    if (hour >= 6 && hour < 18) return 'day'
    else return 'night'
  }

  const snakeCase = (name, timestamp) => {
    if (!name) {
      return 'unknown'
    } else {
      let n = name.toLowerCase()
      if (n.includes('air temperature')) return 'air_temp'
      if (n.includes('humidity')) return 'air_humidity'
      if (n.includes('solar')) return 'solar'
      if (n.includes('vapor')) return 'vpd'
      if (n.includes('integral')) return 'dli'
      if (n.includes('co2')) return 'co2'
      if (n.includes('pore water ec')) return 'pore_ec'
      if (n.includes('moist')) return 'soil_moisture'
      if (n.includes('dry back')) return 'dry_back'
      if (n.includes('soil temperature')) return 'grow_medium_temp'
      if (n.includes('ph')) return 'ph'
      return 'untracked_sensor_data'
    }
  }

  lines.forEach((line, lineIndex) => {
    const timestamp = line.split(',')[0]
    let zone, growth_stage, header
    if (lineIndex > 9) {
      const vals = line.split(',')
      vals.forEach((value, valueIndex) => {
        if (valueIndex > 0) {
          zone = zones[valueIndex]
          growth_stage = growth_stages[valueIndex]
          header = snakeCase(rawHeaders[valueIndex])
          if (header != 'unknown' && header != 'untracked_sensor_data') {
            data.push({
              timestamp,
              zone,
              growth_stage,
              name: header,
              value,
            })
          }
        }
      })
    }
  })

  const getGrowthStage = zone => {
    const result = data.filter(entry => entry.zone === zone)
    return result[0].growth_stage
  }

  const checkRange = (value, growth_stage) => {
    // TODO: map the index to the growth stage
    return (
      value > ranges[0].relative_min[0] && value < ranges[0].relative_max[0]
    )
  }

  const report = data => {
    let result = []
    const uniqueZones = [...new Set(Array.from(zones))]
    uniqueZones.forEach((z, i) => {
      const start_date = data
        .filter(entry => entry.zone === z)[0]
        .timestamp.split(' ')[0]
      const g = getGrowthStage(z)
      const e = data.filter(entry => entry.zone === z).length
      result.push({
        start_date,
        zone: z,
        growth_stage: g,
        entries: e,
        data: data.filter(entry => entry.zone === z),
        origin: 'aroya',
      })
    })
    return result
  }

  const payload = {
    entry_count: data.length,
    report: report(data),
    data,
  }

  return payload
}

export default defineEventHandler(async event => {
  const body = await readBody(event)
  return parse(body)
})

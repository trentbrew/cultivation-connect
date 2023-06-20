const parse = {
  aroya: csv => {
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
    const ports = stretch(lines[6].split(','))
    const sensors = stretch(lines[7].split(','))
    const rawHeaders = stretch(lines[8].split(','))

    console.log('zones: ', zones)
    console.log('ports: ', ports)
    console.log('sensors: ', sensors)
    console.log('rawHeaders: ', rawHeaders)

    const data = [] // all entries

    lines.forEach((line, lineIndex) => {
      const timestamp = line.split(',')[0]
      let zone, growth_stage
      if (lineIndex > 9) {
        const vals = line.split(',')
        vals.forEach((value, valueIndex) => {
          if (valueIndex > 0) {
            zone = zones[valueIndex]
            growth_stage = growth_stages[valueIndex]
            data.push({
              timestamp,
              zone,
              growth_stage,
              name: rawHeaders[valueIndex],
              value,
            })
          }
        })
      }
    })

    const getEntriesPerZone = data => {
      const entriesPerZone = {}
      data.forEach(entry => {
        const { zone } = entry
        if (!entriesPerZone[zone]) entriesPerZone[zone] = 0
        entriesPerZone[zone]++
      })
      return entriesPerZone
    }

    const getGrowthStagePerZone = data => {
      const growthStagePerZone = {}
      data.forEach(entry => {
        const { zone, growth_stage } = entry
        if (!growthStagePerZone[zone]) growthStagePerZone[zone] = ''
        growthStagePerZone[zone] = growth_stage
      })
      return growthStagePerZone
    }

    const payload = {
      entry_count: data.length,
      unique_zones: Array.from(new Set(zones)).length,
      unique_growth_stages: Array.from(new Set(growth_stages)).length,
      entries_per_zone: getEntriesPerZone(data),
      growth_stage_per_zone: getGrowthStagePerZone(data),
      data,
    }

    return payload
  },
}

export default defineEventHandler(async event => {
  const body = await readBody(event)
  return parse.aroya(body)
})

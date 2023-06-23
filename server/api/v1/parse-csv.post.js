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
    const rawHeaders = stretch(lines[8].split(','))

    const data = []

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

    const getGrowthStage = zone => {
      const result = data.filter(entry => entry.zone === zone)
      return result[0].growth_stage
    }

    const report = data => {
      const result = []
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
  },
}

export default defineEventHandler(async event => {
  const body = await readBody(event)
  return parse.aroya(body)
})

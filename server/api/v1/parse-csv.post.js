const parse = {
  aroya: csv => {
    const thesaurus = {
      '% Water Content': 'soil_moisture',
      '°F Soil Temperature': 'soil_temp',
      'mS/cm Pore Water EC': 'pore_ec',
      // TODO: add more headers from Aroya
    }

    const normalize = headers => {
      let result = []
      headers.forEach(header => {
        if (Object.keys(thesaurus).includes(header))
          result.push(thesaurus[header])
      })
      return result
    }

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
    const headers = normalize(stretch(lines[9].split(',')))

    const data = []

    zones.forEach((zone, zoneIndex) => {
      let prospective_cycles = []
      ports.forEach((port, portIndex) => {
        let entries = []
        if (portIndex == zoneIndex) {
          lines.forEach((line, lineIndex) => {
            if (lineIndex > 8) {
              const vals = line.split(',')
              let record = []
              vals.forEach((value, valueIndex) => {
                if (valueIndex > 0 && valueIndex == portIndex) {
                  record.push({
                    ...record,
                    label: rawHeaders[valueIndex],
                    name: headers[valueIndex],
                    value,
                  })
                }
              })
              entries.push({
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
              })
            }
          })
          prospective_cycles.push({
            growth_stage: growth_stages[portIndex],
            zone,
            entries,
          })
        }
      })
      data.push(prospective_cycles)
    })

    return {
      data: data.flat(),
    }
  },
}

export default defineEventHandler(async event => {
  const body = await readBody(event)
  return parse.aroya(body)
})

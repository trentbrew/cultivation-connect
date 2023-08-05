function parse(csv) {
  const lines = csv.split('\n').map(line => line.trim())
  return lines
}

export default defineEventHandler(async event => {
  const body = await readBody(event)
  return parse(body)
})

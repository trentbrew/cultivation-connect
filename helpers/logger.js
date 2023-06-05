var log = console.log

log.clear = console.clear
log.table = console.table

log.warn = console.warn
log.error = console.error

log.label = arg => log(Object.keys({ arg })[0], arg)

log.cyan = (...args) => log('\x1b[36m%s\x1b[0m', ...args)
log.blue = (...args) => log('\x1b[94m%s\x1b[0m', ...args)
log.green = (...args) => log('\x1b[32m%s\x1b[0m', ...args)
log.yellow = (...args) => log('\x1b[33m%s\x1b[0m', ...args)
log.red = (...args) => log('\x1b[91m%s\x1b[0m', ...args)

export default log

import * as log4i from 'log4js'

log4i.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'logs/app.log' }
  },
  categories: {
    default: { appenders: ['out', 'app'], level: 'debug' }
  }
})

export default log4i.getLogger()
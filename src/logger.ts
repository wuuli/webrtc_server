import { configure, getLogger } from 'log4js'

configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%[%d %p -%] %m',
      }
    },
    file: {
      type: 'file',
      filename: './logs/app.log',
      layout: {
        type: 'pattern',
        pattern: '%d %p - %m',
      }
    }
  },
  categories: {
    default: {
      appenders: ['out', 'file'],
      level: 'debug'
    }
  }
})


export const logger = getLogger()

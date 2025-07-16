import Logger, { pino } from 'pino'
import {createLogger} from 'vite'

const pinoLogger = Logger()
const logger = createLogger()

logger.info = (msg, options) =>{
    pinoLogger.info(msg)
}

logger.warn = (msg, options) =>{
    pinoLogger.warn(msg)
}

logger.warnOnce = (msg, options) => {
    pinoLogger.warn(msg)
}

logger.error = (msg, options) =>{
    pinoLogger.error(msg)
}

export default logger;
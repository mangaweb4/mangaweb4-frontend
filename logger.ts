import logger from './src/lib/logger'
import { createLogger } from 'vite'

const customLogger = createLogger()

customLogger.info = (msg, options) => {
    logger.info(msg)
}

customLogger.warn = (msg, options) => {
    logger.warn(msg)
}

customLogger.warnOnce = (msg, options) => {
    logger.warn(msg)
}

customLogger.error = (msg, options) => {
    logger.error(msg)
}

export default customLogger;
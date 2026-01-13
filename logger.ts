import logger from './src/lib/logger';
import { createLogger } from 'vite';

const customLogger = createLogger();

customLogger.info = (msg, _options) => {
	logger.info(msg);
};

customLogger.warn = (msg, _options) => {
	logger.warn(msg);
};

customLogger.warnOnce = (msg, _options) => {
	logger.warn(msg);
};

customLogger.error = (msg, _options) => {
	logger.error(msg);
};

export default customLogger;

import winston from 'winston';
import util from 'util';

const { createLogger, format, transports, addColors } = winston;

/**
 * @typedef LoggerFunction
 * @function
 * @property {...string} args - A string to log.
 */

/**
 * @typedef Logger
 * @property {LoggerFunction} debug - Debug level logger.
 * @property {LoggerFunction} info - Info level logger.
 * @property {LoggerFunction} warning - Warning level logger.
 * @property {LoggerFunction} error - Error level logger.
 * @property {LoggerFunction} critical - Critical level logger.
 */

/**
 * @type {Logger}
 */
let globalLogger = global.logger;

if (!globalLogger) {
  const levels = {
    critical: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
  };

  const colors = {
    critical: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'white',
    debug: 'grey',
  };

  const consoleFormatter = format.printf(
    ({ level, message }) => `${level} - ${message}`
  );

  const logger = createLogger({
    level: 'debug',
    levels,
    exitOnError: false,
    transports: [
      new transports.Console({
        silent: false,
        colorize: true,
        timestamp: true,
        format: format.combine(
          format((info) => {
            info.level = info.level.toUpperCase();
            return info;
          })(),
          format.colorize({ all: true }),
          consoleFormatter
        ),
      }),
    ],
  });

  addColors(colors);

  const argumentsToString = (args) => {
    for (const index in args) {
      if (typeof args[index] === 'object') {
        args[index] = util.inspect(args[index], false, null, true);
      }
    }
    return args.join(' ');
  };

  globalLogger = {
    critical(...args) {
      logger.critical(argumentsToString(args));
    },
    error(...args) {
      logger.error(argumentsToString(args));
    },
    warning(...args) {
      logger.warning(argumentsToString(args));
    },
    info(...args) {
      logger.info(argumentsToString(args));
    },
    debug(...args) {
      logger.debug(argumentsToString(args));
    },
  };
}

export default globalLogger;

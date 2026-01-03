const { createLogger, format, transports, addColors } = require('winston');
const path = require('path');

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

addColors(colors);

const logger = createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
    levels,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format.colorize({ all: true }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            format: format.combine(format.uncolorize(), format.json())
        }),
        new transports.File({
            filename: path.join(__dirname, '../logs/combined.log'),
            format: format.combine(format.uncolorize(), format.json())
        })
    ]
});

module.exports = logger;
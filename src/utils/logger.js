import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config/index.js';
import { existsSync, mkdirSync } from 'fs';

// Ensure logs directory exists
if (!existsSync(config.paths.logs)) {
  mkdirSync(config.paths.logs, { recursive: true });
}

// Custom format for better readability
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `[${timestamp}] ${level.toUpperCase().padEnd(7)} ${message}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }

    return log;
  })
);

// Console format with colors
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level} ${message}`;
  })
);

// Create transports
const transports = [];

// Console transport
if (config.logging.toConsole) {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// File transport with daily rotation
if (config.logging.toFile) {
  transports.push(
    new DailyRotateFile({
      filename: `${config.paths.logs}/app-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: customFormat,
    })
  );

  // Separate error log
  transports.push(
    new DailyRotateFile({
      filename: `${config.paths.logs}/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: customFormat,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  transports,
  exceptionHandlers: transports,
  rejectionHandlers: transports,
});

// Specialized logging methods
export const loggers = {
  // Main logger
  logger,

  // WhatsApp message logging
  whatsapp: {
    received(from, message, isGroup = false) {
      logger.info(`📱 Message ${isGroup ? 'in group' : 'from'}: ${from}`, { message });
    },
    sent(to, message) {
      logger.info(`📤 Sent to: ${to}`, { message });
    },
    media(from, type) {
      logger.info(`📎 Media received from ${from}: ${type}`);
    },
  },

  // AI interaction logging
  ai: {
    request(prompt, hasImage = false) {
      logger.info(`🤖 AI Request${hasImage ? ' (with image)' : ''}`, {
        prompt: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : '')
      });
    },
    response(response, tokensUsed) {
      logger.info(`💬 AI Response (${tokensUsed} tokens)`, {
        response: response.substring(0, 200) + (response.length > 200 ? '...' : '')
      });
    },
    toolUse(toolName, input) {
      logger.info(`🔧 AI Tool: ${toolName}`, { input });
    },
    error(error) {
      logger.error(`❌ AI Error: ${error.message}`, { error: error.stack });
    },
  },

  // Calendar operations
  calendar: {
    create(user, event) {
      logger.info(`📅 Calendar event created for ${user}`, { event });
    },
    delete(user, event) {
      logger.warn(`🗑️ Calendar event deleted for ${user}`, { event });
    },
    list(user, count) {
      logger.info(`📋 Listed ${count} calendar events for ${user}`);
    },
  },

  // Notion operations
  notion: {
    create(user, page) {
      logger.info(`📝 Notion page created for ${user}`, { page });
    },
    update(user, page) {
      logger.info(`✏️ Notion page updated for ${user}`, { page });
    },
    delete(user, page) {
      logger.warn(`🗑️ Notion page deleted for ${user}`, { page });
    },
  },

  // Web search
  search: {
    query(query, source) {
      logger.info(`🔍 Web search via ${source}: "${query}"`);
    },
    results(count) {
      logger.info(`📊 Search returned ${count} results`);
    },
  },

  // State management
  state: {
    waiting(userId, waitingFor) {
      logger.info(`⏸️ State: Waiting for ${waitingFor} from ${userId}`);
    },
    cleared(userId) {
      logger.info(`✨ State cleared for ${userId}`);
    },
    timeout(userId) {
      logger.warn(`⏱️ State timeout for ${userId}`);
    },
  },

  // System events
  system: {
    startup() {
      logger.info('🚀 WhatsApp AI Assistant starting...');
    },
    ready() {
      logger.info('✅ Bot is ready and listening for messages');
    },
    shutdown() {
      logger.info('👋 Shutting down gracefully...');
    },
    error(error) {
      logger.error(`💥 System error: ${error.message}`, { error: error.stack });
    },
  },
};

export default logger;

import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { config } from '../config/index.js';
import { loggers } from '../utils/logger.js';

const { logger } = loggers;

// Ensure data directory exists
if (!existsSync(config.paths.data)) {
  mkdirSync(config.paths.data, { recursive: true });
}

const dbPath = `${config.paths.data}/assistant.db`;
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize database schema
function initializeDatabase() {
  // Conversation history
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      message TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      has_media BOOLEAN DEFAULT 0,
      media_type TEXT,
      INDEX idx_chat_timestamp (chat_id, timestamp)
    )
  `);

  // Long-term memory (facts about users)
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, key)
    )
  `);

  // Conversation state (for multi-turn questions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversation_state (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL UNIQUE,
      waiting_for TEXT,
      context TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    )
  `);

  // User accounts and OAuth tokens
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      whatsapp_number TEXT NOT NULL UNIQUE,
      name TEXT,
      google_tokens TEXT,
      notion_token TEXT,
      preferences TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // AI interaction logs (for analytics and cost tracking)
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      prompt_tokens INTEGER,
      completion_tokens INTEGER,
      total_tokens INTEGER,
      cost_usd REAL,
      tools_used TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Confirmation requests (for destructive actions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS pending_confirmations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      action_type TEXT NOT NULL,
      action_data TEXT NOT NULL,
      message_id TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  logger.info('📦 Database initialized successfully');
}

// Database operations
export const database = {
  // Conversation history
  conversations: {
    add(chatId, sender, message, role, hasMedia = false, mediaType = null) {
      const stmt = db.prepare(`
        INSERT INTO conversations (chat_id, sender, message, role, has_media, media_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      return stmt.run(chatId, sender, message, role, hasMedia ? 1 : 0, mediaType);
    },

    getRecent(chatId, limit = 20) {
      const stmt = db.prepare(`
        SELECT * FROM conversations
        WHERE chat_id = ?
        ORDER BY timestamp DESC
        LIMIT ?
      `);
      return stmt.all(chatId, limit).reverse();
    },

    clear(chatId) {
      const stmt = db.prepare('DELETE FROM conversations WHERE chat_id = ?');
      return stmt.run(chatId);
    },
  },

  // Long-term memory
  memory: {
    set(userId, key, value, category = null) {
      const stmt = db.prepare(`
        INSERT INTO memory (user_id, key, value, category, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, key) DO UPDATE SET
          value = excluded.value,
          category = excluded.category,
          updated_at = CURRENT_TIMESTAMP
      `);
      return stmt.run(userId, key, value, category);
    },

    get(userId, key) {
      const stmt = db.prepare('SELECT value FROM memory WHERE user_id = ? AND key = ?');
      const result = stmt.get(userId, key);
      return result ? result.value : null;
    },

    getAll(userId) {
      const stmt = db.prepare('SELECT key, value, category FROM memory WHERE user_id = ?');
      return stmt.all(userId);
    },

    delete(userId, key) {
      const stmt = db.prepare('DELETE FROM memory WHERE user_id = ? AND key = ?');
      return stmt.run(userId, key);
    },
  },

  // Conversation state
  state: {
    set(chatId, waitingFor, context, timeoutMinutes = 5) {
      const expiresAt = new Date(Date.now() + timeoutMinutes * 60 * 1000).toISOString();
      const stmt = db.prepare(`
        INSERT INTO conversation_state (chat_id, waiting_for, context, expires_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(chat_id) DO UPDATE SET
          waiting_for = excluded.waiting_for,
          context = excluded.context,
          expires_at = excluded.expires_at,
          created_at = CURRENT_TIMESTAMP
      `);
      return stmt.run(chatId, waitingFor, JSON.stringify(context), expiresAt);
    },

    get(chatId) {
      const stmt = db.prepare(`
        SELECT * FROM conversation_state
        WHERE chat_id = ? AND expires_at > CURRENT_TIMESTAMP
      `);
      const result = stmt.get(chatId);
      if (result) {
        result.context = JSON.parse(result.context);
      }
      return result;
    },

    clear(chatId) {
      const stmt = db.prepare('DELETE FROM conversation_state WHERE chat_id = ?');
      return stmt.run(chatId);
    },

    clearExpired() {
      const stmt = db.prepare('DELETE FROM conversation_state WHERE expires_at <= CURRENT_TIMESTAMP');
      return stmt.run();
    },
  },

  // Users
  users: {
    create(whatsappNumber, name) {
      const stmt = db.prepare(`
        INSERT INTO users (whatsapp_number, name)
        VALUES (?, ?)
        ON CONFLICT(whatsapp_number) DO UPDATE SET
          name = excluded.name,
          updated_at = CURRENT_TIMESTAMP
      `);
      return stmt.run(whatsappNumber, name);
    },

    get(whatsappNumber) {
      const stmt = db.prepare('SELECT * FROM users WHERE whatsapp_number = ?');
      const result = stmt.get(whatsappNumber);
      if (result) {
        result.google_tokens = result.google_tokens ? JSON.parse(result.google_tokens) : null;
        result.preferences = result.preferences ? JSON.parse(result.preferences) : {};
      }
      return result;
    },

    setGoogleTokens(whatsappNumber, tokens) {
      const stmt = db.prepare(`
        UPDATE users
        SET google_tokens = ?, updated_at = CURRENT_TIMESTAMP
        WHERE whatsapp_number = ?
      `);
      return stmt.run(JSON.stringify(tokens), whatsappNumber);
    },

    setNotionToken(whatsappNumber, token) {
      const stmt = db.prepare(`
        UPDATE users
        SET notion_token = ?, updated_at = CURRENT_TIMESTAMP
        WHERE whatsapp_number = ?
      `);
      return stmt.run(token, whatsappNumber);
    },
  },

  // AI logs
  aiLogs: {
    add(chatId, userId, promptTokens, completionTokens, totalTokens, toolsUsed = []) {
      // Rough cost estimation (Claude 3.5 Sonnet pricing)
      const costUsd = (promptTokens * 0.003 / 1000) + (completionTokens * 0.015 / 1000);

      const stmt = db.prepare(`
        INSERT INTO ai_logs (chat_id, user_id, prompt_tokens, completion_tokens, total_tokens, cost_usd, tools_used)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      return stmt.run(chatId, userId, promptTokens, completionTokens, totalTokens, costUsd, JSON.stringify(toolsUsed));
    },

    getStats(userId = null, days = 30) {
      const query = userId
        ? `SELECT
            COUNT(*) as requests,
            SUM(total_tokens) as total_tokens,
            SUM(cost_usd) as total_cost
           FROM ai_logs
           WHERE user_id = ? AND timestamp > datetime('now', '-${days} days')`
        : `SELECT
            COUNT(*) as requests,
            SUM(total_tokens) as total_tokens,
            SUM(cost_usd) as total_cost
           FROM ai_logs
           WHERE timestamp > datetime('now', '-${days} days')`;

      const stmt = db.prepare(query);
      return userId ? stmt.get(userId) : stmt.get();
    },
  },

  // Pending confirmations
  confirmations: {
    add(chatId, userId, actionType, actionData, messageId = null, timeoutMinutes = 5) {
      const expiresAt = new Date(Date.now() + timeoutMinutes * 60 * 1000).toISOString();
      const stmt = db.prepare(`
        INSERT INTO pending_confirmations (chat_id, user_id, action_type, action_data, message_id, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      return stmt.run(chatId, userId, actionType, JSON.stringify(actionData), messageId, expiresAt);
    },

    get(chatId) {
      const stmt = db.prepare(`
        SELECT * FROM pending_confirmations
        WHERE chat_id = ? AND expires_at > CURRENT_TIMESTAMP
        ORDER BY created_at DESC
        LIMIT 1
      `);
      const result = stmt.get(chatId);
      if (result) {
        result.action_data = JSON.parse(result.action_data);
      }
      return result;
    },

    clear(chatId) {
      const stmt = db.prepare('DELETE FROM pending_confirmations WHERE chat_id = ?');
      return stmt.run(chatId);
    },

    clearExpired() {
      const stmt = db.prepare('DELETE FROM pending_confirmations WHERE expires_at <= CURRENT_TIMESTAMP');
      return stmt.run();
    },
  },
};

// Initialize on import
initializeDatabase();

// Cleanup expired states periodically
setInterval(() => {
  database.state.clearExpired();
  database.confirmations.clearExpired();
}, 60 * 1000); // Every minute

export default database;

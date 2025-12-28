import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
  // Claude AI
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4096,
  },

  // Bot Configuration
  bot: {
    name: process.env.BOT_NAME || 'bot',
    triggers: (process.env.BOT_TRIGGERS || '@bot,hey bot,bot,').split(','),
  },

  // Google Calendar
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/oauth/callback',
  },

  // Notion
  notion: {
    apiKey: process.env.NOTION_API_KEY,
  },

  // Web Search
  search: {
    brave: {
      apiKey: process.env.BRAVE_SEARCH_API_KEY,
    },
    tavily: {
      apiKey: process.env.TAVILY_API_KEY,
    },
    google: {
      apiKey: process.env.GOOGLE_SEARCH_API_KEY,
      engineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
    },
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    toFile: process.env.LOG_TO_FILE === 'true',
    toConsole: process.env.LOG_TO_CONSOLE !== 'false',
  },

  // Memory & State
  memory: {
    conversationLimit: parseInt(process.env.CONVERSATION_MEMORY_LIMIT || '20'),
    stateTimeoutMinutes: parseInt(process.env.STATE_TIMEOUT_MINUTES || '5'),
  },

  // Feature Flags
  features: {
    webSearch: process.env.ENABLE_WEB_SEARCH !== 'false',
    calendar: process.env.ENABLE_CALENDAR !== 'false',
    notion: process.env.ENABLE_NOTION !== 'false',
    receiptScanning: process.env.ENABLE_RECEIPT_SCANNING !== 'false',
  },

  // Emojis
  emojis: {
    received: process.env.EMOJI_RECEIVED || '👀',
    thinking: process.env.EMOJI_THINKING || '🤔',
    working: process.env.EMOJI_WORKING || '⏳',
    question: process.env.EMOJI_QUESTION || '❓',
    warning: process.env.EMOJI_WARNING || '⚠️',
    success: process.env.EMOJI_SUCCESS || '✅',
    error: process.env.EMOJI_ERROR || '❌',
  },

  // Paths
  paths: {
    root: join(__dirname, '../..'),
    data: join(__dirname, '../../data'),
    logs: join(__dirname, '../../logs'),
    tokens: join(__dirname, '../../tokens'),
  },
};

// Validation
export function validateConfig() {
  const errors = [];

  if (!config.anthropic.apiKey) {
    errors.push('ANTHROPIC_API_KEY is required');
  }

  if (config.features.calendar && (!config.google.clientId || !config.google.clientSecret)) {
    errors.push('Google Calendar enabled but GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set');
  }

  if (config.features.notion && !config.notion.apiKey) {
    errors.push('Notion enabled but NOTION_API_KEY not set');
  }

  if (config.features.webSearch) {
    const hasSearchApi = config.search.brave.apiKey || config.search.tavily.apiKey ||
                         (config.search.google.apiKey && config.search.google.engineId);
    if (!hasSearchApi) {
      errors.push('Web search enabled but no search API key configured');
    }
  }

  return errors;
}

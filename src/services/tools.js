import axios from 'axios';
import { config } from '../config/index.js';
import { loggers } from '../utils/logger.js';

/**
 * Tool definitions for Claude to use
 */

/**
 * Web Search Tool
 */
export const webSearchTool = {
  name: 'web_search',
  description: 'Search the web for current information, news, facts, or answers to questions. Use this when you need up-to-date information or when the user asks about current events.',
  input_schema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query',
      },
    },
    required: ['query'],
  },
};

export async function executeWebSearch(query) {
  loggers.search.query(query, 'Brave');

  try {
    // Try Brave Search first
    if (config.search.brave.apiKey) {
      const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
        headers: {
          'X-Subscription-Token': config.search.brave.apiKey,
        },
        params: {
          q: query,
          count: 5,
        },
      });

      const results = response.data.web?.results || [];
      loggers.search.results(results.length);

      return {
        results: results.map(r => ({
          title: r.title,
          url: r.url,
          description: r.description,
        })),
        source: 'Brave Search',
      };
    }

    // Fallback to Google Custom Search
    if (config.search.google.apiKey && config.search.google.engineId) {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: config.search.google.apiKey,
          cx: config.search.google.engineId,
          q: query,
          num: 5,
        },
      });

      const results = response.data.items || [];
      loggers.search.results(results.length);

      return {
        results: results.map(r => ({
          title: r.title,
          url: r.link,
          description: r.snippet,
        })),
        source: 'Google Search',
      };
    }

    throw new Error('No search API configured');
  } catch (error) {
    loggers.logger.error(`Web search failed: ${error.message}`);
    throw error;
  }
}

/**
 * Calendar Tools
 */
export const calendarCreateTool = {
  name: 'calendar_create',
  description: 'Create a new calendar event. Use this when the user wants to schedule or add something to their calendar.',
  input_schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Event title/summary',
      },
      date: {
        type: 'string',
        description: 'Event date in YYYY-MM-DD format',
      },
      time: {
        type: 'string',
        description: 'Event time in HH:MM format (24-hour)',
      },
      duration_minutes: {
        type: 'number',
        description: 'Event duration in minutes (default: 60)',
      },
      description: {
        type: 'string',
        description: 'Additional details or notes',
      },
      user: {
        type: 'string',
        description: 'Which user\'s calendar (if multiple users)',
      },
    },
    required: ['title', 'date', 'time'],
  },
};

export const calendarListTool = {
  name: 'calendar_list',
  description: 'List upcoming calendar events. Use this when the user wants to see their schedule.',
  input_schema: {
    type: 'object',
    properties: {
      days_ahead: {
        type: 'number',
        description: 'Number of days to look ahead (default: 7)',
      },
      user: {
        type: 'string',
        description: 'Which user\'s calendar to list',
      },
    },
  },
};

export const calendarDeleteTool = {
  name: 'calendar_delete',
  description: 'Delete a calendar event. IMPORTANT: Always confirm with user before deleting.',
  input_schema: {
    type: 'object',
    properties: {
      event_id: {
        type: 'string',
        description: 'The ID of the event to delete',
      },
      event_title: {
        type: 'string',
        description: 'The title of the event (for confirmation)',
      },
      user: {
        type: 'string',
        description: 'Which user\'s calendar',
      },
    },
    required: ['event_id', 'event_title'],
  },
};

/**
 * Notion Tools
 */
export const notionCreateTool = {
  name: 'notion_create',
  description: 'Create a new page in Notion. Use this when the user wants to save notes or create a document.',
  input_schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Page title',
      },
      content: {
        type: 'string',
        description: 'Page content (markdown format)',
      },
      database_id: {
        type: 'string',
        description: 'Notion database ID (if adding to a database)',
      },
    },
    required: ['title', 'content'],
  },
};

/**
 * Memory Tool
 */
export const memoryStoreTool = {
  name: 'memory_store',
  description: 'Store important information about the user for future reference. Use this to remember preferences, facts, or recurring details.',
  input_schema: {
    type: 'object',
    properties: {
      key: {
        type: 'string',
        description: 'A short identifier for this information (e.g., "favorite_restaurant", "partner_birthday")',
      },
      value: {
        type: 'string',
        description: 'The information to remember',
      },
      category: {
        type: 'string',
        description: 'Category of information (e.g., "personal", "preferences", "dates")',
      },
    },
    required: ['key', 'value'],
  },
};

/**
 * Get all available tools based on feature flags
 */
export function getAvailableTools() {
  const tools = [];

  if (config.features.webSearch) {
    tools.push(webSearchTool);
  }

  if (config.features.calendar) {
    tools.push(calendarCreateTool, calendarListTool, calendarDeleteTool);
  }

  if (config.features.notion) {
    tools.push(notionCreateTool);
  }

  // Always include memory
  tools.push(memoryStoreTool);

  return tools;
}

export default {
  webSearchTool,
  executeWebSearch,
  calendarCreateTool,
  calendarListTool,
  calendarDeleteTool,
  notionCreateTool,
  memoryStoreTool,
  getAvailableTools,
};

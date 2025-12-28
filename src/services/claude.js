import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/index.js';
import { loggers } from '../utils/logger.js';
import { database } from '../database/index.js';

const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

/**
 * Claude AI client with vision support and tool use
 */
export class ClaudeClient {
  constructor() {
    this.model = config.anthropic.model;
    this.maxTokens = config.anthropic.maxTokens;
  }

  /**
   * Build conversation context from database
   */
  buildContext(chatId, currentMessage, imageData = null) {
    const history = database.conversations.getRecent(chatId, config.memory.conversationLimit);
    const messages = [];

    // Add conversation history
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.message,
      });
    }

    // Add current message
    const content = [];

    // Add image if present (for receipt scanning, etc.)
    if (imageData) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: imageData.mimeType,
          data: imageData.data,
        },
      });
    }

    // Add text
    content.push({
      type: 'text',
      text: currentMessage,
    });

    messages.push({
      role: 'user',
      content,
    });

    return messages;
  }

  /**
   * Build system prompt with available tools and user context
   */
  buildSystemPrompt(userId, availableTools = []) {
    const userMemory = database.memory.getAll(userId);
    const toolDescriptions = availableTools.map(t => `- ${t.name}: ${t.description}`).join('\n');

    return `You are a helpful AI assistant integrated into WhatsApp. You can help with:
- Scheduling and managing calendar events
- Creating and organizing notes in Notion
- Searching the web for current information
- Processing receipts and extracting itemized information from images
- Answering questions and having conversations

${userMemory.length > 0 ? `\nWhat you know about the user:\n${userMemory.map(m => `- ${m.key}: ${m.value}`).join('\n')}` : ''}

${toolDescriptions.length > 0 ? `\nAvailable tools:\n${toolDescriptions}` : ''}

Guidelines:
- Be concise and helpful - you're in a chat environment
- When you need information, ask clearly
- For destructive actions (delete, cancel), always confirm first
- When processing images (especially receipts), extract all details accurately
- If information is ambiguous, ask clarifying questions
- Remember important facts about users for future conversations
- Use emojis sparingly and only when appropriate

Current conversation is in a WhatsApp group chat.`;
  }

  /**
   * Send a message to Claude and get response
   */
  async chat(chatId, userId, message, imageData = null, tools = []) {
    try {
      const messages = this.buildContext(chatId, message, imageData);
      const systemPrompt = this.buildSystemPrompt(userId, tools);

      loggers.ai.request(message, !!imageData);

      const requestParams = {
        model: this.model,
        max_tokens: this.maxTokens,
        system: systemPrompt,
        messages,
      };

      // Add tools if available
      if (tools.length > 0) {
        requestParams.tools = tools;
      }

      const response = await anthropic.messages.create(requestParams);

      // Log usage
      const usage = response.usage;
      database.aiLogs.add(
        chatId,
        userId,
        usage.input_tokens,
        usage.output_tokens,
        usage.input_tokens + usage.output_tokens,
        this.extractToolsUsed(response)
      );

      loggers.ai.response(
        this.extractTextFromResponse(response),
        usage.input_tokens + usage.output_tokens
      );

      return response;
    } catch (error) {
      loggers.ai.error(error);
      throw error;
    }
  }

  /**
   * Extract text content from Claude's response
   */
  extractTextFromResponse(response) {
    const textBlock = response.content.find(block => block.type === 'text');
    return textBlock ? textBlock.text : '';
  }

  /**
   * Extract tool use from Claude's response
   */
  extractToolUse(response) {
    return response.content.filter(block => block.type === 'tool_use');
  }

  /**
   * Extract list of tools used for logging
   */
  extractToolsUsed(response) {
    const toolUse = this.extractToolUse(response);
    return toolUse.map(t => t.name);
  }

  /**
   * Process receipt image and extract itemized information
   */
  async processReceipt(imageData) {
    try {
      const message = await anthropic.messages.create({
        model: this.model,
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: imageData.mimeType,
                  data: imageData.data,
                },
              },
              {
                type: 'text',
                text: `Please analyze this receipt and extract the following information in a structured format:
1. Business/store name
2. Date of purchase
3. Individual items with prices
4. Subtotal, tax, tip (if applicable)
5. Total amount

Format your response as JSON with this structure:
{
  "business": "name",
  "date": "YYYY-MM-DD",
  "items": [{"name": "item", "price": 0.00}],
  "subtotal": 0.00,
  "tax": 0.00,
  "tip": 0.00,
  "total": 0.00
}`,
              },
            ],
          },
        ],
      });

      const text = this.extractTextFromResponse(message);

      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // If no JSON found, return raw text
      return { raw: text };
    } catch (error) {
      loggers.ai.error(error);
      throw error;
    }
  }

  /**
   * Analyze user intent from message
   */
  async analyzeIntent(message) {
    try {
      const response = await anthropic.messages.create({
        model: this.model,
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `Analyze this user message and determine the intent. Return only a JSON object with:
- intent: one of [calendar_create, calendar_delete, calendar_list, notion_create, notion_update, web_search, general_chat, unclear]
- confidence: 0-1
- entities: extracted information (dates, times, titles, etc.)

Message: "${message}"`,
          },
        ],
      });

      const text = this.extractTextFromResponse(response);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return { intent: 'unclear', confidence: 0 };
    } catch (error) {
      return { intent: 'general_chat', confidence: 0.5 };
    }
  }
}

export default ClaudeClient;

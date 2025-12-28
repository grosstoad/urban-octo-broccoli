import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { config } from '../config/index.js';
import { loggers } from '../utils/logger.js';
import { database } from '../database/index.js';

/**
 * WhatsApp Bot Client
 */
export class WhatsAppBot {
  constructor() {
    this.client = null;
    this.ready = false;
    this.messageHandlers = [];
  }

  /**
   * Initialize WhatsApp client
   */
  initialize() {
    loggers.system.startup();

    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      },
    });

    this.setupEventHandlers();
    this.client.initialize();

    return this;
  }

  /**
   * Setup event handlers
   */
  setupEventHandlers() {
    // QR Code for authentication
    this.client.on('qr', (qr) => {
      console.log('\n📱 Scan this QR code with WhatsApp:\n');
      qrcode.generate(qr, { small: true });
      console.log('\n');
    });

    // Ready
    this.client.on('ready', () => {
      this.ready = true;
      loggers.system.ready();
    });

    // Authenticated
    this.client.on('authenticated', () => {
      loggers.logger.info('✅ WhatsApp authenticated successfully');
    });

    // Authentication failure
    this.client.on('auth_failure', (msg) => {
      loggers.system.error(new Error(`Authentication failed: ${msg}`));
    });

    // Disconnected
    this.client.on('disconnected', (reason) => {
      loggers.logger.warn(`⚠️ WhatsApp disconnected: ${reason}`);
      this.ready = false;
    });

    // Message received
    this.client.on('message_create', async (message) => {
      // Ignore messages sent by the bot itself
      if (message.fromMe) return;

      await this.handleMessage(message);
    });
  }

  /**
   * Check if message mentions the bot
   */
  isBotMentioned(messageBody) {
    const lowerBody = messageBody.toLowerCase().trim();

    return config.bot.triggers.some(trigger => {
      const lowerTrigger = trigger.toLowerCase().trim();

      // Check if message starts with trigger
      if (lowerBody.startsWith(lowerTrigger)) return true;

      // Check if message contains trigger as a word
      const regex = new RegExp(`\\b${lowerTrigger}\\b`, 'i');
      return regex.test(lowerBody);
    });
  }

  /**
   * Remove bot mention from message
   */
  removeBotMention(messageBody) {
    let cleaned = messageBody;

    config.bot.triggers.forEach(trigger => {
      const regex = new RegExp(`^${trigger}[,:\\s]*`, 'i');
      cleaned = cleaned.replace(regex, '');
    });

    return cleaned.trim();
  }

  /**
   * Handle incoming message
   */
  async handleMessage(message) {
    try {
      const chat = await message.getChat();
      const contact = await message.getContact();

      // Log the message
      const isGroup = chat.isGroup;
      const sender = contact.pushname || contact.number;
      const chatName = isGroup ? chat.name : sender;

      loggers.whatsapp.received(chatName, message.body, isGroup);

      // Check if bot is mentioned
      if (!this.isBotMentioned(message.body)) {
        // Check if we're waiting for a response from this chat
        const state = database.state.get(chat.id._serialized);
        if (!state) {
          return; // Ignore - bot not mentioned and no pending state
        }
      }

      // Process the message through registered handlers
      for (const handler of this.messageHandlers) {
        await handler(message, chat, contact);
      }
    } catch (error) {
      loggers.system.error(error);
    }
  }

  /**
   * Register a message handler
   */
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  /**
   * Send a text message
   */
  async sendMessage(chatId, text) {
    try {
      await this.client.sendMessage(chatId, text);
      loggers.whatsapp.sent(chatId, text);
    } catch (error) {
      loggers.system.error(error);
      throw error;
    }
  }

  /**
   * React to a message with emoji
   */
  async reactToMessage(message, emoji) {
    try {
      await message.react(emoji);
    } catch (error) {
      // Reactions might not be supported in all WhatsApp versions
      loggers.logger.warn(`Failed to react to message: ${error.message}`);
    }
  }

  /**
   * Download media from message
   */
  async downloadMedia(message) {
    try {
      if (!message.hasMedia) return null;

      loggers.whatsapp.media(
        message.from,
        message.type
      );

      const media = await message.downloadMedia();

      return {
        mimeType: media.mimetype,
        data: media.data, // base64
        filename: media.filename,
      };
    } catch (error) {
      loggers.system.error(error);
      return null;
    }
  }

  /**
   * Check if message has an image
   */
  hasImage(message) {
    return message.hasMedia && message.type === 'image';
  }

  /**
   * Get chat by ID
   */
  async getChat(chatId) {
    return await this.client.getChatById(chatId);
  }

  /**
   * Destroy client
   */
  async destroy() {
    loggers.system.shutdown();
    await this.client.destroy();
  }
}

export default WhatsAppBot;

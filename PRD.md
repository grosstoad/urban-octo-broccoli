# Product Requirements Document (PRD)
## WhatsApp AI Assistant

**Version:** 1.0
**Last Updated:** 2025-12-28
**Status:** Draft

---

## 1. Overview

### 1.1 Product Vision
A WhatsApp-based AI assistant that helps a couple (two users) manage their calendar, notes, and information needs through natural conversation in a group chat.

### 1.2 Goals
- Provide intelligent assistance for calendar management, note-taking, and information retrieval
- Support multiple user accounts (separate Google Calendar and Notion for each person)
- Process receipts and extract itemized information from images
- Maintain conversation context and long-term memory
- Ensure safe operations with confirmations for destructive actions

### 1.3 Non-Goals
- Support for more than 2-3 users
- Public/commercial deployment
- Real-time voice/video integration
- Mobile app (WhatsApp only)

---

## 2. User Stories

### 2.1 Core Interactions

**US-001: Mention-based Activation**
- As a user, I want the bot to only respond when I mention it (e.g., "@bot"), so it doesn't interrupt normal conversations
- Acceptance Criteria:
  - Bot ignores messages without mention triggers
  - Bot responds to @bot, "hey bot", "bot,", etc.
  - Bot continues conversation context without needing mention for follow-up questions

**US-002: Emoji Acknowledgments**
- As a user, I want visual feedback on bot status, so I know it's working
- Acceptance Criteria:
  - 👀 Immediate reaction when message received
  - 🤔 When AI is processing complex requests
  - ⏳ When calling external APIs (Calendar, Notion, search)
  - ❓ When asking clarifying questions
  - ⚠️ When requesting confirmation
  - ✅ When task completed successfully
  - ❌ When error occurred

### 2.2 Calendar Management

**US-003: Create Calendar Events**
- As a user, I want to add events to my calendar via chat, so I don't need to open the Calendar app
- Acceptance Criteria:
  - Parse natural language ("dentist tomorrow at 2pm")
  - Ask for missing information (date, time, title)
  - Support "my calendar" vs "partner's calendar" vs "both"
  - Confirm event creation with details

**US-004: List Calendar Events**
- As a user, I want to see upcoming events, so I know my schedule
- Acceptance Criteria:
  - List events for next N days (default 7)
  - Show date, time, title
  - Support filtering by user

**US-005: Delete Calendar Events**
- As a user, I want to cancel/delete events safely
- Acceptance Criteria:
  - **MUST request explicit confirmation before deletion**
  - Show event details (title, date, time)
  - Wait for "YES" to proceed, "NO" to cancel
  - Auto-cancel after timeout (60 seconds)

**US-006: Multiple Google Accounts**
- As a user, I want both my partner and I to have separate calendars
- Acceptance Criteria:
  - OAuth flow for each user
  - Store tokens separately in database
  - Auto-detect or ask which calendar to use
  - Support adding to both calendars simultaneously

### 2.3 Receipt Processing

**US-007: Receipt Image Scanning**
- As a user, I want to take a photo of a receipt and have it processed
- Acceptance Criteria:
  - Accept image via WhatsApp
  - Extract: business name, date, items, prices, tax, tip, total
  - Present itemized breakdown
  - Ask how to add to calendar (single event, itemized, existing event)

**US-008: Receipt to Calendar**
- As a user, I want receipts automatically added to my calendar for expense tracking
- Acceptance Criteria:
  - Option 1: Single event with total
  - Option 2: Itemized event with full breakdown in description
  - Option 3: Add to existing event
  - Option 4: Cancel

### 2.4 Web Search

**US-009: Real-time Information**
- As a user, I want the bot to search the web for current information
- Acceptance Criteria:
  - Use Claude Agent SDK built-in web search
  - Provide sources/links when applicable
  - Search for: weather, news, facts, prices, reviews, etc.

### 2.5 Notion Integration

**US-010: Create Notion Pages**
- As a user, I want to save notes and information to Notion
- Acceptance Criteria:
  - Create new pages with title and content
  - Support markdown formatting
  - Confirm creation with link to page

**US-011: Update Notion Pages**
- As a user, I want to update existing pages
- Acceptance Criteria:
  - Search for page by title
  - Append or replace content
  - Confirm update

**US-012: Delete Notion Pages**
- As a user, I want to delete Notion pages safely
- Acceptance Criteria:
  - **MUST request explicit confirmation**
  - Show page title
  - Wait for "YES" to proceed

### 2.6 Memory & Context

**US-013: Conversation Memory**
- As a user, I want the bot to remember our conversation, so I don't repeat myself
- Acceptance Criteria:
  - Remember last 20 messages in conversation
  - Use context for follow-up questions
  - Clear context on command or timeout

**US-014: Long-term Memory**
- As a user, I want the bot to remember important facts (birthdays, preferences, etc.)
- Acceptance Criteria:
  - Store user preferences, facts, dates
  - Retrieve memory when relevant
  - Allow viewing/editing stored facts
  - Store in SQLite database

### 2.7 Intelligent Questioning

**US-015: Ask Clarifying Questions**
- As a user, I want the bot to ask questions when unclear, so it performs the right action
- Acceptance Criteria:
  - Identify missing information
  - Ask specific questions
  - Maintain conversation state
  - Timeout after 5 minutes of no response
  - Allow multiple back-and-forth exchanges

**US-016: Multi-option Selection**
- As a user, I want to choose from options for ambiguous requests
- Acceptance Criteria:
  - Present numbered options (1️⃣, 2️⃣, 3️⃣)
  - Accept numeric or text responses
  - Validate selection

### 2.8 Safety & Confirmations

**US-017: Destructive Action Confirmation**
- As a user, I want confirmation before anything is deleted or cancelled
- Acceptance Criteria:
  - **REQUIRED for:** calendar event deletion, Notion page deletion, cancellations
  - Show what will be deleted with full details
  - Require explicit "YES" (case insensitive)
  - Auto-cancel after 60 seconds
  - Log all confirmations

---

## 3. Technical Requirements

### 3.1 Architecture

#### 3.1.1 WhatsApp Integration Decision

**Recommended: WhatsApp Business API** ✅
- Official Meta API (no ban risk)
- Free tier: 1,000 conversations/month (your 300/month is covered)
- User-initiated conversations: FREE
- Serverless deployment possible (Vercel, Cloudflare Workers)
- Lower total cost: $4-6/month vs $7-11/month with whatsapp-web.js
- Production-ready with SLA
- Setup time: 1-2 weeks (approval process)

**Alternative: whatsapp-web.js** ⚠️
- For prototyping/testing only
- FREE but violates WhatsApp ToS (ban risk)
- Requires persistent server (Docker/VPS)
- Quick setup (QR code, immediate)
- Plan to migrate to Business API for production
- Use throwaway phone number only

**See `WHATSAPP_COMPARISON.md` for detailed analysis**

#### 3.1.2 Core Components
- **WhatsApp Client:** WhatsApp Business API (Cloud API recommended)
- **AI Engine:** Claude Agent SDK (with built-in web search)
- **Database:** SQLite for conversation history, memory, state
- **Logging:** Winston with daily rotation
- **Deployment:** Serverless (Vercel) or Container (Railway/Fly.io)

#### 3.1.3 Data Flow
```
WhatsApp Message → Bot Receives → Check Mention
                                    ↓
                        React with 👀 emoji
                                    ↓
                        Extract message + image (if present)
                                    ↓
                        Load conversation context from DB
                                    ↓
                        Send to Claude Agent SDK
                                    ↓
                    Claude processes with available tools:
                    - Web search (built-in)
                    - Calendar (custom)
                    - Notion (custom)
                    - Memory (custom)
                                    ↓
                        Execute tool calls
                                    ↓
                    Return response to WhatsApp
                                    ↓
                        React with ✅ emoji
```

### 3.2 Database Schema

#### 3.2.1 Tables

**conversations**
- `id` (PK)
- `chat_id` (indexed)
- `sender`
- `message`
- `role` (user/assistant)
- `timestamp` (indexed)
- `has_media` (boolean)
- `media_type`

**memory**
- `id` (PK)
- `user_id`
- `key` (unique per user)
- `value`
- `category`
- `created_at`
- `updated_at`

**conversation_state**
- `id` (PK)
- `chat_id` (unique)
- `waiting_for` (enum: calendar_time, confirmation, etc.)
- `context` (JSON)
- `created_at`
- `expires_at`

**users**
- `id` (PK)
- `whatsapp_number` (unique)
- `name`
- `google_tokens` (JSON)
- `notion_token`
- `preferences` (JSON)
- `created_at`
- `updated_at`

**pending_confirmations**
- `id` (PK)
- `chat_id`
- `user_id`
- `action_type` (delete_calendar, delete_notion, etc.)
- `action_data` (JSON)
- `message_id`
- `expires_at`
- `created_at`

**ai_logs**
- `id` (PK)
- `chat_id`
- `user_id`
- `prompt_tokens`
- `completion_tokens`
- `total_tokens`
- `cost_usd`
- `tools_used` (JSON array)
- `timestamp`

### 3.3 API Integrations

#### 3.3.1 Claude Agent SDK
- Model: claude-3-5-sonnet-20241022
- Features: Vision, tool use, built-in web search
- Max tokens: 4096

#### 3.3.2 Google Calendar API
- OAuth 2.0 authentication
- Scopes: calendar.events (read/write)
- Support for multiple accounts

#### 3.3.3 Notion API
- Integration token authentication
- Pages API for create/update/delete
- Search API for finding pages

### 3.4 Environment Variables

**Required:**
- `ANTHROPIC_API_KEY` - Claude API key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `NOTION_API_KEY` - Notion integration token

**Optional:**
- `BOT_NAME` - Default: "bot"
- `BOT_TRIGGERS` - Comma-separated triggers
- `LOG_LEVEL` - Default: "info"
- `CONVERSATION_MEMORY_LIMIT` - Default: 20
- `STATE_TIMEOUT_MINUTES` - Default: 5
- Feature flags (ENABLE_WEB_SEARCH, etc.)

### 3.5 Deployment Requirements

#### 3.5.1 Infrastructure
- **Compute:** VPS/container with persistent storage
- **Memory:** Minimum 1GB RAM
- **Storage:** 10GB for logs, database, WhatsApp session
- **Network:** Stable connection for WhatsApp Web

#### 3.5.2 Docker
- Multi-stage build
- Chromium included for Puppeteer
- Health checks
- Volume mounts for persistence:
  - `.wwebjs_auth` (WhatsApp session)
  - `logs` (application logs)
  - `data` (SQLite database)
  - `tokens` (OAuth tokens)

### 3.6 Logging & Observability

#### 3.6.1 Log Categories
- **WhatsApp:** All messages sent/received
- **AI:** All Claude API requests/responses, token usage
- **Tools:** Calendar/Notion/search operations
- **State:** Conversation state changes
- **Errors:** All errors with stack traces

#### 3.6.2 Log Format
- Timestamp
- Level (info, warn, error)
- Category (whatsapp, ai, calendar, etc.)
- Message
- Metadata (JSON)

#### 3.6.3 Log Storage
- Daily rotation (one file per day)
- Retention: 14 days for info, 30 days for errors
- Max size: 20MB per file

#### 3.6.4 Metrics Tracking
- Total messages processed
- AI token usage and cost
- Tool usage counts
- Error rates
- Response times

---

## 4. User Experience

### 4.1 Example Conversation Flows

#### 4.1.1 Add Calendar Event
```
User: @bot add dentist appointment tomorrow at 2pm
Bot: 👀
Bot: 🤔 Processing...
Bot: ❓ Which calendar?
     1️⃣ Your calendar
     2️⃣ Partner's calendar
     3️⃣ Both
User: 1
Bot: ⏳ Adding to calendar...
Bot: ✅ Added to your Google Calendar

     📅 Dentist Appointment
     🕐 Dec 29, 2025 at 2:00 PM
     ⏱️ Duration: 1 hour
```

#### 4.1.2 Receipt Processing
```
User: [Sends receipt image]
      @bot add this to calendar
Bot: 👀
Bot: 🤔 Reading receipt...
Bot: ✅ Receipt from "Tony's Italian Restaurant"

     📋 Items:
     • Margherita Pizza - $18.00
     • Caesar Salad - $12.00
     • Wine (2 glasses) - $16.00
     • Tip - $9.20

     💰 Total: $55.20
     📅 Date: Dec 27, 2025

     ❓ Add to calendar as:
     1️⃣ Single event "Dinner at Tony's - $55.20"
     2️⃣ Itemized event (full breakdown in description)
     3️⃣ Add to existing event
     4️⃣ Cancel
User: 2
Bot: ⏳ Creating calendar event...
Bot: ✅ Added to your Google Calendar

     Event: Dinner at Tony's Italian Restaurant
     Amount: $55.20
     Date: Dec 27, 2025

     View in calendar for full itemized list
```

#### 4.1.3 Delete with Confirmation
```
User: @bot delete the dentist appointment
Bot: 👀
Bot: ⚠️ Confirm deletion:

     📅 Dentist Appointment
     🕐 Dec 29, 2025 at 2:00 PM

     Reply with YES to delete, NO to cancel
     (Auto-cancel in 60 seconds)
User: YES
Bot: ⏳ Deleting from calendar...
Bot: ✅ Deleted from your Google Calendar
```

#### 4.1.4 Web Search
```
User: @bot what's the weather in Tokyo tomorrow?
Bot: 👀
Bot: 🔍 Searching...
Bot: ✅ Weather forecast for Tokyo, Dec 29:

     🌤️ Partly cloudy
     🌡️ High: 12°C (54°F)
     🌡️ Low: 6°C (43°F)
     💧 Precipitation: 10%

     Source: weather.com
```

#### 4.1.5 Clarifying Questions
```
User: @bot add appointment
Bot: 👀
Bot: ❓ I need a few details:
     • What's the appointment for?
     • What date?
     • What time?
User: dentist, tomorrow, 2pm
Bot: ⏳ Adding to calendar...
Bot: ✅ Added: Dentist - Dec 29, 2:00 PM
```

### 4.2 Error Handling

#### 4.2.1 API Failures
```
Bot: ❌ Sorry, I couldn't connect to Google Calendar.
     Please try again in a moment.
```

#### 4.2.2 Ambiguous Input
```
Bot: ❓ I found 3 dentist appointments. Which one?
     1️⃣ Dec 29 at 2:00 PM
     2️⃣ Jan 15 at 10:00 AM
     3️⃣ Feb 3 at 3:30 PM
```

#### 4.2.3 Timeout
```
Bot: ⏱️ Request timed out. Mention me again when ready!
```

---

## 5. Security & Privacy

### 5.1 Data Protection
- Store OAuth tokens encrypted at rest
- No logging of sensitive data (passwords, full tokens)
- WhatsApp end-to-end encryption (inherent)
- Local database only (no cloud sync)

### 5.2 Access Control
- Bot only responds to authorized WhatsApp group
- OAuth separate per user
- No cross-user data access

### 5.3 Rate Limiting
- Max 100 AI requests per day per user (configurable)
- Max 50 calendar operations per day per user
- Prevent abuse/spam

---

## 6. Success Metrics

### 6.1 Functionality
- ✅ Successfully creates calendar events 95%+ of time
- ✅ Receipt scanning accuracy 90%+
- ✅ Web search provides relevant results 90%+
- ✅ Zero unauthorized deletions (100% confirmation)

### 6.2 Performance
- ✅ Response time <3 seconds for simple queries
- ✅ Receipt processing <10 seconds
- ✅ 99% uptime

### 6.3 User Experience
- ✅ Emoji acknowledgments appear within 1 second
- ✅ Clarifying questions asked when needed
- ✅ Conversation context maintained for session

---

## 7. Future Enhancements (Out of Scope for V1)

### 7.1 Phase 2
- SMS/Email integration
- Recurring events support
- Budget tracking from receipts
- Voice message transcription
- Multi-language support

### 7.2 Phase 3
- Mobile app (native)
- Team/family expansion (5+ users)
- Advanced analytics dashboard
- AI-suggested scheduling
- Integration with more services (Slack, Trello, etc.)

---

## 8. Open Questions

1. **OAuth Setup:** Where should OAuth callback be hosted? (Localhost for initial setup, then?)
2. **Notion Database:** Should we create a specific database structure or use root pages?
3. **Cost Management:** What's the budget for Claude API usage? (Approximately $0.003-0.015 per conversation)
4. **Deployment:** Railway vs Fly.io vs self-hosted VPS?
5. **Backup Strategy:** How often should we backup the SQLite database?
6. **Multiple Devices:** What happens if WhatsApp session needs to move to a different device?

---

## 9. Dependencies & Risks

### 9.1 External Dependencies
- WhatsApp Web API (unofficial via whatsapp-web.js)
- Claude Agent SDK stability
- Google Calendar API availability
- Notion API availability

### 9.2 Risks
- **High:** WhatsApp could ban/block unofficial API usage
- **Medium:** Claude Agent SDK breaking changes
- **Medium:** OAuth token expiration handling
- **Low:** Chromium/Puppeteer compatibility issues

### 9.3 Mitigation
- Regular backups of conversation data
- Graceful degradation if APIs fail
- User notification of service issues
- Alternative WhatsApp Business API path if needed

---

## 10. Acceptance Criteria for V1 Launch

- [ ] Bot authenticates with WhatsApp via QR code
- [ ] Bot only responds when mentioned in group chat
- [ ] Emoji status indicators work correctly
- [ ] Can create calendar events for both users
- [ ] Can list upcoming calendar events
- [ ] Deletion requests require confirmation
- [ ] Receipt image scanning extracts itemized data
- [ ] Receipts can be added to calendar
- [ ] Web search returns relevant results
- [ ] Can create Notion pages
- [ ] Conversation context maintained for 20 messages
- [ ] Long-term memory stores and retrieves facts
- [ ] State machine handles multi-turn questions
- [ ] All operations logged to files
- [ ] Docker deployment works
- [ ] README with setup instructions complete

---

**End of PRD**

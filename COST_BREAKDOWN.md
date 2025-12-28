# Monthly Cost Breakdown
## WhatsApp AI Assistant - 10 Conversations/Day

**Last Updated:** 2025-12-28
**Assumptions:** 10 conversations per day × 30 days = 300 conversations/month

---

## 1. Claude API Pricing (Main Cost)

### Claude Sonnet 4.5 (2025 Pricing)

| Component | Price |
|-----------|-------|
| **Input tokens** | $3.00 per 1M tokens |
| **Output tokens** | $15.00 per 1M tokens |

**Cost Breakdown:**
- Input: $0.000003 per token
- Output: $0.000015 per token

### Estimated Token Usage Per Conversation

Based on your use case (calendar, receipts, search, Notion):

**Typical conversation:**
- **Input:** ~2,000 tokens (conversation history + system prompt + tools + user message)
- **Output:** ~500 tokens (bot response)

**With image (receipt scanning):**
- **Input:** ~3,500 tokens (image = ~1,500 tokens + text)
- **Output:** ~800 tokens (detailed receipt breakdown)

**Complex multi-turn (with web search/calendar):**
- **Input:** ~4,000 tokens (context + search results + tool responses)
- **Output:** ~1,000 tokens

### Monthly Cost Calculation

**Scenario 1: Light Usage (Simple conversations)**
- 300 conversations/month
- Average: 2,000 input + 500 output tokens per conversation

```
Input:  300 × 2,000 = 600,000 tokens → $1.80
Output: 300 × 500   = 150,000 tokens → $2.25
Total: $4.05/month
```

**Scenario 2: Moderate Usage (Mix of simple + receipt scanning)**
- 200 simple conversations (2,000/500 tokens)
- 50 receipt scans (3,500/800 tokens)
- 50 complex conversations (4,000/1,000 tokens)

```
Simple:
  Input:  200 × 2,000 = 400,000 tokens → $1.20
  Output: 200 × 500   = 100,000 tokens → $1.50

Receipts:
  Input:  50 × 3,500  = 175,000 tokens → $0.53
  Output: 50 × 800    = 40,000 tokens  → $0.60

Complex:
  Input:  50 × 4,000  = 200,000 tokens → $0.60
  Output: 50 × 1,000  = 50,000 tokens  → $0.75

Total: $5.18/month
```

**Scenario 3: Heavy Usage (Lots of receipts + web search)**
- 100 simple conversations
- 100 receipt scans
- 100 complex conversations with web search

```
Simple:
  Input:  100 × 2,000 = 200,000 tokens → $0.60
  Output: 100 × 500   = 50,000 tokens  → $0.75

Receipts:
  Input:  100 × 3,500 = 350,000 tokens → $1.05
  Output: 100 × 800   = 80,000 tokens  → $1.20

Complex:
  Input:  100 × 4,000 = 400,000 tokens → $1.20
  Output: 100 × 1,000 = 100,000 tokens → $1.50

Total: $6.30/month
```

### Cost-Saving Features

**Prompt Caching (Up to 90% savings):**
- Cache read tokens: $0.30 per 1M tokens (90% discount)
- Your system prompt and tool definitions can be cached
- Potential savings: ~$0.50-1.00/month

**Batch API (50% discount):**
- Input: $1.50 per 1M tokens
- Output: $7.50 per 1M tokens
- **Not applicable** for real-time chat (only for async processing)

---

## 2. Integration APIs

### Google Calendar API
**Cost:** ✅ **FREE**
- No charges for API usage
- Usage quotas: 1,000,000 queries/day (way more than needed)
- Rate limit: 10 queries/second per user

**Your usage:** ~10-30 API calls/day → **$0/month**

### Notion API
**Cost:** ✅ **FREE**
- No charges for API usage
- Rate limit: 3 requests/second (average)
- Burst limit: 2,700 calls per 15 minutes

**Your usage:** ~5-20 API calls/day → **$0/month**

### WhatsApp Web (whatsapp-web.js)
**Cost:** ✅ **FREE**
- Uses WhatsApp Web (unofficial, no API fees)
- **Important:** This is NOT WhatsApp Business API
- **Risk:** Against WhatsApp ToS (potential ban)

**Alternative - WhatsApp Business API:**
- Would cost ~$0.005-0.05 per conversation
- **Free tier:** Unlimited service conversations (when user messages first)
- **Your usage:** 300 conversations → **$0/month** (if users initiate)
- **Marketing messages:** $0.03-0.15 per message (varies by country)

---

## 3. Deployment Costs

### Option A: Railway
**Cost:** $5/month minimum
- 512MB RAM, shared CPU
- Suitable for this bot
- Easy deployment
- Persistent storage included

**Pros:** Simple, one-click deploy, logs, metrics
**Cons:** Pricier than alternatives

### Option B: Fly.io
**Cost:** ~$3-5/month
- 256MB RAM: Free (but limited)
- 1GB RAM: ~$3/month (recommended)
- Persistent volumes: $0.15/GB/month

**Pros:** Cheaper, good free tier
**Cons:** Slightly more complex setup

### Option C: Self-Hosted VPS

**DigitalOcean Droplet:**
- $6/month (1GB RAM, 25GB SSD)
- Full control, can host other services too

**Oracle Cloud Free Tier:**
- **FREE** (2 VMs, 1GB RAM each, 100GB storage)
- Forever free tier
- **Best value**

**Raspberry Pi (Home):**
- **FREE** (one-time $35-75 hardware cost)
- ~$2/month electricity
- Requires stable home internet

### Option D: Serverless (Not Recommended)
- Vercel/Netlify: ❌ Won't work (needs persistent WebSocket)
- AWS Lambda: ❌ Not suitable for WhatsApp Web

---

## 4. Total Monthly Cost Summary

| Scenario | Claude API | APIs | Deployment | **Total/Month** |
|----------|-----------|------|------------|----------------|
| **Light (Railway)** | $4.05 | $0 | $5.00 | **$9.05** |
| **Light (Fly.io)** | $4.05 | $0 | $3.00 | **$7.05** |
| **Light (Oracle Free)** | $4.05 | $0 | $0 | **$4.05** |
| | | | | |
| **Moderate (Railway)** | $5.18 | $0 | $5.00 | **$10.18** |
| **Moderate (Fly.io)** | $5.18 | $0 | $3.00 | **$8.18** |
| **Moderate (Oracle Free)** | $5.18 | $0 | $0 | **$5.18** |
| | | | | |
| **Heavy (Railway)** | $6.30 | $0 | $5.00 | **$11.30** |
| **Heavy (Fly.io)** | $6.30 | $0 | $3.00 | **$9.30** |
| **Heavy (Oracle Free)** | $6.30 | $0 | $0 | **$6.30** |

### With Prompt Caching Enabled
Subtract ~$0.50-1.00 from Claude API costs above.

---

## 5. Cost Per Conversation Breakdown

| Type | Input Tokens | Output Tokens | Cost/Conversation |
|------|-------------|---------------|-------------------|
| **Simple chat** | 2,000 | 500 | $0.0135 (~1.4¢) |
| **Receipt scan** | 3,500 | 800 | $0.0225 (~2.3¢) |
| **Complex (search/calendar)** | 4,000 | 1,000 | $0.0270 (~2.7¢) |

**Average:** ~$0.017 per conversation (1.7¢)

---

## 6. Annual Projection

Based on **Moderate Usage** scenario:

| Component | Monthly | Annual |
|-----------|---------|--------|
| Claude API | $5.18 | $62.16 |
| APIs (Google/Notion) | $0 | $0 |
| Deployment (Fly.io) | $3.00 | $36.00 |
| **Total** | **$8.18** | **$98.16** |

**With Oracle Cloud Free Tier:** ~$62/year (Claude only)

---

## 7. Cost Comparison: SDK vs Direct API

### Claude Agent SDK
- Uses same Anthropic API under the hood
- **Same pricing** as direct API
- Additional features: Built-in web search, file ops, agent loop
- **No extra cost** for SDK features

### Direct Anthropic API
- Same $3/$15 per 1M tokens
- Manual implementation of all features
- More control but more code

**Verdict:** Agent SDK is better value (same cost, more features)

---

## 8. Cost Optimization Tips

### 1. Enable Prompt Caching
- Cache system prompt and tool definitions
- Save ~$0.50-1.00/month (10-20% reduction)

### 2. Use Shorter Conversation History
- Current: 20 messages (~1,000 tokens)
- Reduce to 10 messages → Save ~500 tokens/conversation
- Savings: ~$0.50/month

### 3. Optimize Tool Definitions
- Keep tool descriptions concise
- Only include tools when needed
- Savings: ~100-200 tokens/conversation

### 4. Use Oracle Cloud Free Tier
- Eliminates deployment costs entirely
- Save $36-60/year

### 5. Batch Similar Requests
- If processing multiple receipts, batch them
- Use prompt caching for repeated structure
- Savings: ~10-15%

---

## 9. Budget Recommendations

### Recommended Monthly Budget

| Usage Level | Budget | Headroom |
|-------------|--------|----------|
| **Light (10 conv/day)** | $10/month | Safe |
| **Moderate (15 conv/day)** | $15/month | Comfortable |
| **Heavy (20-30 conv/day)** | $20/month | Room to grow |

### Cost Alerts
Set up billing alerts in Anthropic Console:
- **Warning:** $10/month
- **Limit:** $15/month (adjustable)

---

## 10. Hidden Costs to Consider

| Item | Cost | Frequency |
|------|------|-----------|
| **Domain name** (optional) | $10-15 | Yearly |
| **SSL certificate** (Let's Encrypt) | $0 | Free |
| **Backup storage** (S3/B2) | $0.01-0.10 | Monthly |
| **Monitoring** (UptimeRobot) | $0 | Free tier |
| **Time investment** | 🕐 | Initial setup |

---

## 11. ROI Analysis

### What You're Replacing

| Task | Manual Time | Bot Time | Time Saved |
|------|------------|----------|------------|
| Add calendar event | 2 min | 10 sec | 1m 50s |
| Process receipt | 5 min | 15 sec | 4m 45s |
| Search information | 3 min | 10 sec | 2m 50s |
| Create Notion note | 3 min | 15 sec | 2m 45s |

**10 tasks/day = ~30 minutes saved**
**Monthly time savings: ~15 hours**

**Value of time saved:**
- At $20/hr: **$300/month** value
- At $50/hr: **$750/month** value
- At $100/hr: **$1,500/month** value

**ROI:** Even at minimum wage, ROI is ~30x your costs

---

## Summary

### ✅ Best Setup for Cost Efficiency

**Configuration:**
- **Claude Agent SDK** (built-in search)
- **Oracle Cloud Free Tier** (deployment)
- **Prompt caching enabled**
- **10 conversations/day**

**Total Cost:** ~$4-5/month (Claude API only)

### 📊 Expected Costs

- **Minimum:** $4/month (Oracle + light usage)
- **Typical:** $8-10/month (Fly.io + moderate usage)
- **Maximum:** $15/month (Railway + heavy usage with buffer)

**Cost per conversation:** 1.4¢ - 2.7¢ depending on complexity

---

**Sources:**
- [Claude Sonnet 4.5 Pricing Guide 2025](https://www.cursor-ide.com/blog/claude-sonnet-4-5-pricing)
- [Anthropic Pricing Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [Google Calendar API Quotas](https://developers.google.com/workspace/calendar/api/guides/quota)
- [Notion API Rate Limits](https://developers.notion.com/reference/request-limits)
- [WhatsApp Business Platform Pricing](https://business.whatsapp.com/products/platform-pricing)

# WhatsApp Business API - Complete Setup Guide (2025)
## Detailed Step-by-Step with Real Requirements

**Last Updated:** 2025-12-28
**Based on:** Current Meta documentation and real-world implementations

---

## Table of Contents
1. [Two Setup Methods](#two-setup-methods)
2. [Method 1: Embedded Signup (Fastest)](#method-1-embedded-signup)
3. [Method 2: Manual Setup (Traditional)](#method-2-manual-setup)
4. [Phone Number Requirements & Verification](#phone-number-verification)
5. [Access Tokens & System Users](#access-tokens)
6. [Webhook Configuration](#webhook-configuration)
7. [Messaging Limits & Verification](#messaging-limits)
8. [Common Errors & Troubleshooting](#troubleshooting)
9. [Real Timeline Expectations](#timeline)

---

## Two Setup Methods

Meta offers two different approaches in 2025:

### Embedded Signup (Recommended for 2025)
- **Timeline:** 10 minutes - 2 business days
- **Complexity:** Low
- **Best for:** Quick setup, small businesses, personal projects
- **Automates:** Business verification, phone setup
- **Platform:** Usually through BSP (Business Solution Provider) like Infobip, Twilio, etc.

### Manual Setup (Traditional)
- **Timeline:** 1-2 weeks
- **Complexity:** High
- **Best for:** Custom integrations, full control
- **Manual steps:** Everything
- **Platform:** Direct through Meta Developer Portal

---

## Method 1: Embedded Signup (Fastest)

### What is Embedded Signup?

Embedded Signup is Meta's streamlined onboarding introduced to simplify the WhatsApp Business API setup process. Instead of navigating multiple platforms (Facebook Business Manager, Meta Developer Portal), you complete everything through a single interface.

**Key Benefits:**
- Setup in minutes vs days
- No manual Business Manager navigation
- Automated business verification
- User-friendly wizard interface

### Prerequisites

✅ **Facebook Account**
- Personal Facebook account (doesn't need to be business)
- Email verified
- Account in good standing

✅ **Phone Number**
- NOT currently on WhatsApp Personal or Business
- Can receive SMS/voice calls
- Valid format with country code

✅ **Business Information** (Basic)
- Business name (can be personal/project name)
- Address (can be home address)
- Website (optional for small use)

❌ **NOT Required Initially:**
- Registered business entity
- Tax ID/business documents
- Business verification (handled automatically)

### Step-by-Step: Embedded Signup

**Note:** Embedded signup is typically offered through BSPs (Business Solution Providers). If you want direct Meta setup, skip to Method 2.

#### Option A: Through BSP (Twilio, Infobip, MessageBird, etc.)

1. **Sign up with BSP**
   - Example: Twilio → WhatsApp product
   - Click "Get Started with WhatsApp"
   - Choose "Embedded Signup"

2. **Connect Facebook Account**
   - Click "Connect your Facebook Account"
   - Log in with Facebook
   - Grant permissions

3. **Business Information Form**
   - Business Display Name: "Your Bot Name" (e.g., "Personal Assistant")
   - Category: Choose closest match (e.g., "Business Services")
   - Description: Brief description of your bot
   - Address: Your address
   - Website: (optional)

4. **Phone Number**
   - Option 1: Use their provided number ($1-15/month)
   - Option 2: Add your own number
   - Enter phone number with country code
   - Receive verification code via SMS
   - Enter code

5. **Review & Submit**
   - Review all information
   - Accept WhatsApp Business Terms
   - Submit

**Result:** Typically approved within 10 minutes to 2 business days

---

## Method 2: Manual Setup (Traditional - Direct with Meta)

This is the traditional method going directly through Meta's platforms.

### Phase 1: Create Meta Business Account

**URL:** https://business.facebook.com/

**Time:** 15-20 minutes

#### Steps:

1. **Initial Account Creation**
   - Click "Create Account"
   - Choose: "Create a Business Account"
   - Enter:
     - Business Account Name: (can be project name, doesn't need to be registered business)
     - Your name
     - Your business email
   - Click "Next"

2. **Account Details**
   - Business Details:
     - Address (required - can be home address)
     - Phone number (your personal number, NOT the WhatsApp number)
     - Website (optional but recommended)
   - Click "Submit"

3. **Email Verification**
   - Check email
   - Click verification link
   - Return to Business Manager

4. **Two-Factor Authentication**
   - **IMPORTANT:** Enable 2FA on your Facebook account
   - Business Settings → Security Center → Two-Factor Authentication
   - Set up via SMS or authenticator app
   - **This is MANDATORY** for WhatsApp Business API

5. **Add Payment Method** (Optional but Recommended)
   - Business Settings → Payments
   - Add credit card
   - **Note:** You won't be charged for free tier usage
   - Required for: phone number rental, going over free tier

**✅ Meta Business Account Created**

---

### Phase 2: Create Meta Developer App

**URL:** https://developers.facebook.com/apps/

**Time:** 10-15 minutes

#### Steps:

1. **Navigate to Apps**
   - Go to https://developers.facebook.com/apps/
   - Click "Create App"

2. **Select App Type**
   - Choose: **"Business"**
   - (NOT "Consumer" or "Gaming")
   - Click "Next"

3. **App Information**
   - App Name: "Your Bot Name" (e.g., "WhatsApp AI Assistant")
   - App Contact Email: Your email
   - Business Portfolio: Select your Meta Business Account (created in Phase 1)
   - Click "Create App"

4. **App Dashboard**
   - You'll be redirected to App Dashboard
   - App ID is shown (save this)

**✅ Meta App Created**

---

### Phase 3: Add WhatsApp Product

**Location:** App Dashboard → Add Product

**Time:** 5-10 minutes

#### Steps:

1. **Add WhatsApp**
   - Scroll to "WhatsApp" product
   - Click "Set up"

2. **Choose API Type**
   - **Cloud API** (Recommended)
     - Hosted by Meta
     - No infrastructure needed
     - Easier webhook setup
   - OR **On-Premises API** (Being sunset in Oct 2025 - avoid)
   - Choose: **Cloud API**
   - Click "Get Started"

3. **WhatsApp Business Account (WABA)**
   - Option 1: Create new WhatsApp Business Account
     - Name: Your bot/business name
     - Timezone: Your timezone
     - Currency: Your currency
   - Option 2: Use existing WABA (if you have one)
   - Choose Option 1 for new setup
   - Click "Continue"

4. **Quick Setup Screen**
   - You'll see:
     - Test phone number (provided by Meta)
     - Temporary access token (24hr)
     - Phone Number ID
     - WhatsApp Business Account ID
   - **Copy all these values** → save to `.env` file

**✅ WhatsApp Product Added**

---

### Phase 4: Phone Number Setup

**Location:** WhatsApp → Phone Numbers

**Time:** 5 minutes setup + 1-3 days approval

#### Important Phone Number Requirements:

**✅ Must Have:**
- Ability to receive SMS or voice calls
- Valid country code format (e.g., +12345678900)
- NOT already registered on WhatsApp (Personal or Business)
- Active number (you'll need to keep it active)

**❌ Cannot Use:**
- Numbers currently on WhatsApp Personal
- Numbers on another WhatsApp Business API account
- Invalid formats (must include +country code, no spaces/dashes)
- Landline numbers that can't receive SMS (unless voice verification works)

#### Steps:

1. **Navigate to Phone Numbers**
   - App Dashboard → WhatsApp → Phone Numbers
   - Click "Add phone number"

2. **Choose Number Source**

   **Option A: Use Your Own Number**
   - Select "Add phone number"
   - Enter: +[country code][number] (no spaces)
   - Example: +12125551234 (NOT +1 212-555-1234)
   - Click "Next"

   **Option B: Get Number from Meta**
   - Select "Request a new phone number"
   - Choose country
   - Select from available numbers
   - Cost: $0-15/month (varies by country)
   - Click "Next"

3. **Verification Method**
   - Two options will appear:
     - **SMS:** (Most common)
     - **Voice call:** (If SMS not available)
   - Choose SMS
   - Click "Next"

4. **Enter Verification Code**
   - Meta sends 6-digit code
   - Enter code within 10 minutes
   - Click "Verify"

5. **Set Display Name**
   - Display Name: What users see when you message them
   - Example: "Personal Assistant" or "Family Bot"
   - **Note:** Display name approval needed for visibility (see Messaging Limits section)
   - Click "Submit"

6. **Two-Step Verification PIN (Highly Recommended)**
   - You'll be prompted to create a 6-digit PIN
   - This prevents unauthorized number transfers
   - **Create one** - you'll need it for account recovery
   - Save this PIN securely

**⏳ Status: Pending Approval (1-3 days typical, up to 7 days max)**

#### What Happens During Approval:

Meta validates:
- Number ownership
- Number not in use elsewhere
- Valid business use case (usually automatic for small usage)

**Common Delays:**
- Incorrect number format
- Number already registered (even if deleted recently - wait 24hrs)
- Suspicious activity on Facebook account
- Missing two-factor authentication

**✅ Phone Number Verified** (once approved)

---

## Phase 5: Generate Permanent Access Token

**CRITICAL:** The test token shown initially expires in 24 hours. You need a permanent token.

**Location:** Business Settings → System Users

**Time:** 10 minutes

### Steps:

1. **Navigate to System Users**
   - Go to https://business.facebook.com/settings/system-users
   - OR: Business Settings → Users → System Users
   - Click "Add" → Create new system user

2. **Create System User**
   - System User Name: "WhatsApp Bot" or "API User"
   - System User Role: **Admin** (required for WhatsApp permissions)
   - Click "Create System User"

3. **Assign Assets**
   - Find your newly created system user
   - Click "Add Assets"
   - Select: **Apps**
   - Choose your app (created in Phase 2)
   - Toggle permissions:
     - ✅ Full Control
   - Click "Save Changes"

4. **Generate Token**
   - Click your system user name
   - Click "Generate New Token"
   - Select your app
   - Choose permissions:
     - ✅ `whatsapp_business_management`
     - ✅ `whatsapp_business_messaging`
   - Expiration: **Never** (permanent)
   - Click "Generate Token"

5. **Save Token**
   - **COPY THE TOKEN IMMEDIATELY**
   - This is shown only once
   - Save to `.env` file as `WHATSAPP_ACCESS_TOKEN`
   - Store securely (treat like a password)

**Token Format:**
```
EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**✅ Permanent Access Token Created**

---

## Webhook Configuration

**Location:** App Dashboard → WhatsApp → Configuration

**Time:** 20-30 minutes (if bot already deployed)

### Prerequisites:

Your webhook endpoint must:
- ✅ Be HTTPS (not HTTP)
- ✅ Have valid SSL certificate
- ✅ Respond within 5 seconds
- ✅ Return correct verification response
- ✅ Be publicly accessible (no localhost - use ngrok for testing)

### Development: Using ngrok

If developing locally:

```bash
# Install ngrok
npm install -g ngrok

# Start your bot
npm start  # Runs on port 3000

# In another terminal
ngrok http 3000

# Copy the HTTPS URL
# Example: https://abc123.ngrok.io
```

### Webhook Verification Code

Your endpoint must handle GET requests for verification:

```javascript
// Express.js example
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verify token matches
  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge);  // Must return challenge
  } else {
    res.status(403).send('Forbidden');
  }
});

// Handle incoming messages (POST)
app.post('/webhook', (req, res) => {
  const body = req.body;

  // Process webhook payload
  if (body.object === 'whatsapp_business_account') {
    // Handle message
    console.log('Message received:', JSON.stringify(body, null, 2));
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.status(404).send('Not Found');
  }
});
```

### Configure in Meta:

1. **Navigate to Webhook**
   - App Dashboard → WhatsApp → Configuration
   - Find "Webhook" section
   - Click "Edit"

2. **Enter Webhook Details**
   - **Callback URL:** Your HTTPS endpoint
     - Example: `https://abc123.ngrok.io/webhook`
     - Or: `https://your-bot.fly.dev/webhook`
   - **Verify Token:** Create a secret string
     - Example: `my_secret_verify_token_12345`
     - Save this to `.env` as `WEBHOOK_VERIFY_TOKEN`
   - Click "Verify and Save"

3. **Verification Process**
   - Meta sends GET request to your webhook
   - Your webhook must return the challenge
   - If successful: "Webhook verified" ✅
   - If failed: Error message with reason

**Common Errors:**
- `URL couldn't be validated`: Webhook not responding or wrong code
- `Connection timeout`: Webhook took > 5 seconds
- `SSL certificate error`: Invalid HTTPS setup

4. **Subscribe to Webhook Fields**
   - After verification, enable fields:
     - ✅ `messages` (incoming messages)
     - ✅ `message_status` (delivery, read receipts)
   - Click "Subscribe"

**✅ Webhook Configured**

---

## Messaging Limits & Verification

### Default Limits (Unverified Business)

When you first set up, you have:

**Messaging Tier: Tier 1 (250 conversations/24hrs)**
- 250 business-initiated conversations per 24-hour rolling period
- Unlimited user-initiated conversations (FREE)
- 2 phone numbers max
- Display name **may not be visible** to recipients (shows number instead)

**For your use case (10 conv/day, user-initiated):**
- ✅ All conversations are user-initiated (you/partner message first)
- ✅ Unlimited user-initiated = FREE
- ✅ Well within limits
- ⚠️ Display name might not show (users see your phone number)

### Tier Progression

As you send more messages successfully, Meta automatically increases your limit:

| Tier | Limit | How to Reach |
|------|-------|--------------|
| **Tier 1** | 250/day | Default (start here) |
| **Tier 2** | 1,000/day | Send 250 messages over 7 days |
| **Tier 3** | 10,000/day | Send 1,000 messages over 7 days |
| **Tier 4** | 100,000/day | Send 10,000 messages over 7 days |
| **Unlimited** | No limit | Business Verification required |

**Quality Rating Matters:**
- Messages must have high quality rating
- Low quality → limits decrease
- Spam → account banned

### Business Verification (Optional for You)

**When Required:**
- Unlimited messaging
- Display name visibility everywhere
- Access to advanced features
- Higher trust/credibility

**When NOT Required:**
- < 10,000 messages/day (your case: 300/month)
- User-initiated conversations only
- Don't care about display name showing

**If You Want to Verify Anyway:**

**Required Documents:**
- Business registration document (Certificate of Incorporation, Business License)
- OR: Tax document with business name
- OR: Utility bill with business address
- Valid website (can be personal blog, LinkedIn)

**Process:**
1. Business Settings → Security Center
2. Start Verification
3. Upload documents
4. Wait 1-14 business days
5. Approval email

**For your use case: Skip this initially** ✅

---

## Common Errors & Troubleshooting

### Phone Number Errors

#### Error: "Phone number already registered"
**Cause:** Number is on WhatsApp Personal or another Business account

**Solutions:**
- Option 1: Delete WhatsApp Personal from that number, wait 24hrs, try again
- Option 2: Use different number
- Option 3: Contact support if you believe it's not registered

---

#### Error: "Phone number verification failed"
**Cause:** Didn't receive SMS code or entered wrong code

**Solutions:**
- Try voice call option instead of SMS
- Check number format (must be +country code + number, no spaces)
- Ensure number can receive SMS/calls
- Wait 10 minutes, try again

---

#### Error: "Two-step verification PIN mismatch"
**Cause:** Entered wrong PIN during setup

**Solutions:**
- Verify PIN and re-enter
- If locked out: wait lockout period (varies, usually 12-24hrs)
- Reset PIN via SMS (if set up)

---

### Webhook Errors

#### Error: "URL couldn't be validated"
**Cause:** Webhook not responding correctly to verification

**Solutions:**
1. Check webhook is running (`curl https://your-url/webhook`)
2. Verify GET endpoint returns challenge
3. Check verify token matches exactly
4. Look at server logs for errors
5. Test with ngrok if using localhost

**Test your webhook:**
```bash
# Simulate Meta's verification request
curl -X GET "https://your-url/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE_STRING"

# Should return: CHALLENGE_STRING
```

---

#### Error: "Connection timeout"
**Cause:** Webhook took > 5 seconds to respond

**Solutions:**
- Optimize webhook response time
- Return 200 immediately, process async
- Check server resources
- Use faster hosting

---

### Access Token Errors

#### Error: "Invalid OAuth access token"
**Cause:** Token expired (using 24hr test token) or malformed

**Solutions:**
- Generate permanent System User token (see Phase 5)
- Check token copied correctly (no extra spaces)
- Verify token has correct permissions
- Regenerate token if compromised

---

### Message Sending Errors

#### Error: "Message failed to send - 131026"
**Cause:** Recipient number not on WhatsApp

**Solutions:**
- Verify recipient has WhatsApp installed
- Check number format correct
- Test with your own number first

---

#### Error: "Message failed to send - 131047"
**Cause:** Conversation rate limit exceeded

**Solutions:**
- You've hit your messaging tier limit (250/day default)
- Wait 24hrs for reset
- Use user-initiated conversations (unlimited)
- Request tier increase (happens automatically with usage)

---

## Real Timeline Expectations

### Embedded Signup (Best Case):
```
Day 1, Hour 1:  Sign up with BSP
Day 1, Hour 1:  Complete embedded signup form (15 min)
Day 1, Hour 1:  Phone verification (5 min)
Day 1, Hour 1-2: Automatic approval (10 min - 2 hrs)
✅ Total: 30 minutes - 2 business days
```

### Manual Setup (Typical):
```
Day 1, Hour 1:   Create Meta Business Account (20 min)
Day 1, Hour 1:   Create Meta App (15 min)
Day 1, Hour 1:   Add WhatsApp product (10 min)
Day 1, Hour 1:   Add phone number (5 min)
Day 1-3:         Wait for phone approval (1-3 days)
Day 2, Hour 1:   Generate system user token (10 min)
Day 2, Hour 2:   Configure webhook (30 min)
Day 2-3:         Test with approved number
✅ Total: 2-4 days
```

### With Business Verification (Long Path):
```
Week 1:      Complete manual setup (above)
Week 1:      Submit business verification documents
Week 2-3:    Wait for business verification (1-14 business days)
Week 3:      Approval or rejection
If rejected: Fix issues, resubmit (another 1-2 weeks)
✅ Total: 2-6 weeks
```

### For Your Use Case (Recommended):
```
Day 1:  Manual setup through Meta (1 hour work)
Day 2-4: Wait for phone approval
Day 4:  Start using with user-initiated conversations
✅ Total: 3-4 days
        No business verification needed
```

---

## Summary: What You Actually Need

### Minimum Requirements (Your Use Case):

✅ **Facebook account** (15 min)
✅ **Meta Business Account** (20 min)
✅ **Meta App with WhatsApp** (20 min)
✅ **Phone number** (5 min + 1-3 days approval)
✅ **Webhook endpoint** (30 min if bot ready)
✅ **Permanent access token** (10 min)

**Total active work:** ~2 hours
**Total calendar time:** 2-4 days (mostly waiting)
**Cost:** $0 (if using own number + free hosting)

❌ **NOT Needed:**
- Business registration
- Tax documents
- Business verification (unless you want unlimited + display name)
- Payment method (unless renting number or exceeding free tier)

---

## Next Steps

1. **Start Today:**
   - [ ] Create Meta Business Account
   - [ ] Create Meta Developer App
   - [ ] Add WhatsApp Product
   - [ ] Submit phone number for verification

2. **While Waiting (Day 1-3):**
   - [ ] I'll build the webhook handler
   - [ ] Set up bot infrastructure
   - [ ] Test with Meta's test number
   - [ ] Deploy to hosting

3. **When Approved (Day 3-4):**
   - [ ] Switch to your real number
   - [ ] Configure webhook with your endpoint
   - [ ] Add to group chat
   - [ ] Start using!

---

## Resources

**Official Documentation:**
- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Meta Business Help](https://business.facebook.com/business/help)
- [WhatsApp Developer Hub](https://business.whatsapp.com/developers/developer-hub)

**Setup Guides:**
- [Embedded Signup Guide](https://frejun.com/whatsapp-business-embedded-signup-guide/)
- [Step-by-step Manual Setup](https://www.infobip.com/blog/whatsapp-business-api-setup)
- [Webhook Configuration](https://docs.suprsend.com/docs/whatsapp-cloud-api)

**Troubleshooting:**
- [Error Codes Reference](https://www.heltar.com/blogs/all-meta-error-codes-explained-along-with-complete-troubleshooting-guide-2025-cm69x5e0k000710xtwup66500)
- [Business Verification Help](https://respond.io/help/whatsapp/meta-business-verification)
- [Phone Number Issues](https://www.sobot.io/article/troubleshoot-new-number-for-whatsapp-business-registration-issues/)

---

**Ready to start?** The process is more straightforward than it seems - most of the time is just waiting for approval, not active work.

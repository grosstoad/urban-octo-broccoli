# WhatsApp Business API Setup Guide
## Getting Approved and Setting Up

**Last Updated:** 2025-12-28

---

## Overview

**Timeline:** 1-2 weeks total
- Meta Business Account setup: 15 minutes
- App creation & configuration: 30-60 minutes
- Phone number verification: 1-3 days
- Business verification (if required): 1-2 weeks

**Difficulty:** Medium (mostly waiting, not technically complex)

---

## Prerequisites

### What You Need:

✅ **Facebook Account** (personal account is fine)
✅ **Phone Number** for WhatsApp Business
   - Can be new or existing
   - Can't be currently on WhatsApp personal
   - Options: New SIM, Google Voice, Twilio number
✅ **Business Information** (optional but recommended)
   - Business name
   - Business address
   - Business website (can be personal blog)
✅ **Credit Card** (for verification, won't be charged for free tier)

### What You DON'T Need:
❌ Registered business entity
❌ Tax ID/EIN
❌ Business documentation (for small use)
❌ Physical office

---

## Step-by-Step Setup

### Phase 1: Meta Business Account (15 minutes)

#### 1. Create Meta Business Account

**Go to:** https://business.facebook.com/

1. Click **"Create Account"**
2. Enter:
   - Your name (can be personal name)
   - Business account name (e.g., "Personal Assistant Project")
   - Your work email
3. Verify email
4. Complete profile:
   - Address (can be home address)
   - Phone number
   - Business details (optional)

**✅ You now have a Meta Business Account**

---

#### 2. Set Up Meta App

**Go to:** https://developers.facebook.com/apps/

1. Click **"Create App"**
2. Select use case: **"Other"** → **"Business"**
3. Fill in details:
   - App name: e.g., "WhatsApp AI Assistant"
   - App contact email: your email
   - Business Account: Select the one you just created
4. Click **"Create App"**

**✅ You now have a Meta App**

---

### Phase 2: Add WhatsApp Product (30 minutes)

#### 3. Add WhatsApp to Your App

1. In your app dashboard, find **"Add Products"**
2. Find **"WhatsApp"** → Click **"Set Up"**
3. Choose **"Cloud API"** (recommended)
   - Hosted by Meta
   - Easier setup
   - No infrastructure management
   - Alternative: "On-Premises API" (more complex)

**✅ WhatsApp Product Added**

---

#### 4. Get Test Phone Number

Meta provides a **temporary test number** immediately:

1. In WhatsApp setup, go to **"API Setup"**
2. You'll see a **test phone number** (e.g., +1 555...)
3. Add your personal WhatsApp number as a **recipient**
4. Click **"Send Message"** to test

**This allows immediate testing while you wait for real number approval**

---

#### 5. Set Up Webhook

Your bot needs a webhook URL to receive messages.

**Webhook Requirements:**
- HTTPS endpoint (no HTTP)
- Must respond to verification requests
- Must process messages

**Options:**

**Option A: Use ngrok for Testing**
```bash
# Install ngrok
npm install -g ngrok

# Start your bot locally (we'll build this)
npm start

# In another terminal, expose it
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Option B: Deploy to Railway/Fly.io First**
- Deploy your bot (we'll build this)
- Use the production URL (e.g., https://your-bot.fly.dev)

**Configure Webhook in Meta:**
1. Go to **WhatsApp → Configuration**
2. Click **"Edit"** next to Webhook
3. Enter:
   - **Callback URL:** Your HTTPS URL + `/webhook`
   - **Verify Token:** Create a random string (e.g., `my_secret_token_123`)
   - Save these in your `.env` file
4. Click **"Verify and Save"**

**Note:** Your bot must be running and respond to verification request

---

#### 6. Subscribe to Webhook Events

1. In **Webhook Fields**, enable:
   - ✅ `messages` (receive messages)
   - ✅ `message_status` (delivery status)
2. Click **"Subscribe"**

**✅ Webhook configured**

---

### Phase 3: Add Your Phone Number (1-3 days)

#### 7. Add Your WhatsApp Business Number

**Go to:** WhatsApp → Settings → Phone Numbers

**Option A: Get New Number from Meta ($0-15/month)**
1. Click **"Add Phone Number"**
2. Select country
3. Choose number from available options
4. Add payment method (charged monthly if not free)

**Option B: Use Your Own Number (FREE)**
1. Click **"Add Phone Number"**
2. Enter your phone number
3. **Important:** This number CANNOT be on WhatsApp Personal
   - If it is, you'll need to delete WhatsApp Personal first
   - Or get a new number

**Verification Process:**
1. Meta sends SMS verification code
2. Enter code
3. You'll get a voice call with another code
4. Enter second code
5. **Wait 24-48 hours for approval**

**Status:** Check in "Phone Numbers" section
- 🟡 Pending
- 🟢 Approved
- 🔴 Rejected (rare, contact support)

**✅ Phone number verification submitted**

---

### Phase 4: Get API Credentials

#### 8. Copy Your Credentials

**Go to:** WhatsApp → API Setup

Copy these values (you'll need them in `.env`):

```bash
# From "Temporary access token" section
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxx

# From "Phone number ID" section
WHATSAPP_PHONE_NUMBER_ID=123456789012345

# From "WhatsApp Business Account ID"
WHATSAPP_BUSINESS_ACCOUNT_ID=234567890123456

# Your webhook verify token (that you created earlier)
WEBHOOK_VERIFY_TOKEN=my_secret_token_123

# Your actual phone number (after approval)
WHATSAPP_PHONE_NUMBER=+1234567890
```

**⚠️ Important: Temporary vs Permanent Token**

The access token shown is **temporary (24 hours)**.

**To get permanent token:**
1. Go to **WhatsApp → Settings → App Settings**
2. Under **"Access Tokens"**, click **"Generate Token"**
3. Select permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
4. Copy the **System User Token** (doesn't expire)
5. Replace `WHATSAPP_ACCESS_TOKEN` with this

**✅ API credentials obtained**

---

### Phase 5: Business Verification (Optional, 1-2 weeks)

#### 9. Business Verification (May Not Be Required)

**When Required:**
- Sending 1,000+ messages per day
- Using advanced features
- Requesting higher limits

**For Your Use Case (10 conv/day):**
- ✅ **NOT required initially**
- You can skip this and come back later if needed

**If/When You Need It:**

1. **Go to:** Business Settings → Security Center
2. Click **"Start Verification"**
3. Provide:
   - Business documentation (utility bill, business license, etc.)
   - Business phone number
   - Business address
   - Website (can be LinkedIn, personal site)
4. **Wait 1-2 weeks** for review

**Tips:**
- Use consistent information across all fields
- Provide clear, legible documents
- Use business email domain (not Gmail if possible)
- Have a legitimate business reason

**✅ Verification submitted (if needed)**

---

## Quick Start Path (No Business Verification)

### For Personal/Small Use (Your Use Case):

**You can start immediately without business verification:**

1. ✅ Create Meta Business Account (15 min)
2. ✅ Create App & Add WhatsApp (15 min)
3. ✅ Use test number for development (immediate)
4. ✅ Add your personal number (1-3 days)
5. ✅ Start using within free tier (1,000 conv/month)

**No business verification needed for:**
- < 1,000 conversations/month
- Basic messaging
- Your 300 conversations/month use case

---

## Cost Breakdown (Setup)

| Item | Cost | When |
|------|------|------|
| **Meta Business Account** | Free | Always |
| **Meta App** | Free | Always |
| **WhatsApp Cloud API** | Free | Always |
| **Phone Number (Meta)** | $0-15/month | Optional |
| **Phone Number (Own)** | $0 | If you have one |
| **Business Verification** | Free | Optional |
| **Messages (Free Tier)** | $0 | First 1,000 conv/month |

**Total Setup Cost: $0** (if using your own number)

---

## Common Issues & Solutions

### Issue 1: "Phone Number Already Registered"

**Problem:** Number is on WhatsApp Personal

**Solution:**
- Option A: Delete WhatsApp Personal from that number first
- Option B: Get a new number (Google Voice, Twilio)
- Option C: Use Meta-provided number ($0-15/month)

---

### Issue 2: "Webhook Verification Failed"

**Problem:** Your webhook isn't responding correctly

**Solution:**
```javascript
// Your webhook must respond to GET requests like this:
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});
```

---

### Issue 3: "Access Token Expired"

**Problem:** Using temporary 24-hour token

**Solution:**
- Generate **System User Token** (doesn't expire)
- See Phase 4, Step 8 above

---

### Issue 4: "Number Verification Pending for Days"

**Problem:** Meta review is taking longer

**Solution:**
- Usually resolves in 24-48 hours
- Check spam for Meta emails
- Contact support: https://business.facebook.com/business/help
- Use test number in meantime

---

## Testing Your Setup

### Using Test Number (Immediate):

```bash
# Send a test message via Meta's test feature
1. Go to WhatsApp → API Setup
2. Click "Send Message"
3. Enter your personal WhatsApp number
4. Send test message
```

### Using cURL (Once Webhook is Set Up):

```bash
curl -X POST \
  "https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "YOUR_PHONE_NUMBER",
    "type": "text",
    "text": {
      "body": "Hello from WhatsApp Business API!"
    }
  }'
```

---

## What's Next After Approval

Once approved, you'll:

1. ✅ **Build webhook handler** (we'll do this)
2. ✅ **Integrate Claude Agent SDK** (we'll do this)
3. ✅ **Add to group chat** (with you and partner)
4. ✅ **Start using!**

---

## Approval Timeline Summary

| Phase | Time | Can You Test? |
|-------|------|---------------|
| **Meta Account + App** | 15 min | ✅ Yes (test number) |
| **Webhook Setup** | 30 min | ✅ Yes (test number) |
| **Phone Verification** | 1-3 days | ⏳ Wait |
| **Business Verification** | 1-2 weeks | ❌ Not needed initially |

**Realistic Timeline:** 2-4 days for basic setup

---

## Tips for Faster Approval

### ✅ Do:
- Use real, verifiable phone number
- Complete all profile fields
- Use consistent information
- Have a legitimate website/online presence
- Verify email immediately
- Respond to Meta emails quickly

### ❌ Don't:
- Use VoIP numbers (if possible)
- Use temporary/burner numbers
- Provide inconsistent information
- Skip profile fields
- Ignore verification emails

---

## Free Tier Limits

Once approved, you get:

| Limit | Value | Your Usage |
|-------|-------|------------|
| **Free conversations** | 1,000/month | 300/month ✅ |
| **Service conversations** | Unlimited | ✅ |
| **Recipients** | 250 unique/day | 2 (you + partner) ✅ |
| **Messages per second** | 80 | Way more than needed ✅ |

**You're well within free tier limits!**

---

## Cost After Free Tier

If you exceed 1,000 conversations/month:

**User-initiated (FREE):**
- When your partner/you message first
- Bot responds within 24 hours
- **Your use case: 100% user-initiated → Still FREE**

**Bot-initiated (Paid):**
- When bot messages first
- Requires approved templates
- $0.005-0.15 per conversation
- **Your use case: Not needed**

---

## Alternative: Skip Approval, Use Test Number

**For Development Only:**

You can start building immediately with:
- Meta's test number (provided instantly)
- Can message your own number
- No approval wait
- Limited to test messages

**Good for:** Learning, building, testing
**Not good for:** Production use with partner

---

## Recommended Path for You

### Week 1: Start Approval Process
**Day 1:**
- [ ] Create Meta Business Account
- [ ] Create App & Add WhatsApp
- [ ] Submit phone number for verification

**Day 1-3: While Waiting**
- [ ] Build webhook handler
- [ ] Integrate Claude Agent SDK
- [ ] Test with Meta test number
- [ ] Test with your own WhatsApp (receiving test messages)

### Week 2: Go Live
**Day 4-7:**
- [ ] Phone number approved ✅
- [ ] Switch from test to real number
- [ ] Add to group chat with partner
- [ ] Start using!

---

## Resources

- **Official Docs:** https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- **Meta Business Help:** https://business.facebook.com/business/help
- **WhatsApp Business Policies:** https://www.whatsapp.com/legal/business-policy
- **API Reference:** https://developers.facebook.com/docs/whatsapp/cloud-api/reference

---

## Next Steps

1. **Start account creation now** (don't wait)
2. **While waiting for approval, I'll build the bot**
3. **Test with Meta test number**
4. **Switch to real number when approved**

**Ready to start? I can guide you through any specific step!**

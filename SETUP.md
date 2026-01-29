# RAG Chatbot - GitHub Web Setup Guide

## 📁 Files to Upload to GitHub

You need to upload these files to your GitHub repo. Here's the structure:

```
your-repo-name/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── upload/
│   │   └── page.tsx
│   └── api/
│       ├── chat/
│       │   └── route.ts
│       └── embed/
│           └── route.ts
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── README.md
```

---

## 🚀 STEP-BY-STEP SETUP

### STEP 1: Upload Files to GitHub (10 minutes)

**Option A: Upload individual files** (if you want to understand structure)

1. Go to your GitHub repo
2. Click "Add file" → "Create new file"
3. For filename, type: `app/page.tsx`
   - This creates the `app` folder
4. Copy/paste the contents from the file
5. Click "Commit new file"
6. Repeat for each file (use the full path like `app/api/chat/route.ts`)

**Option B: Upload all at once** (EASIER - recommended)

1. Download all files to your computer
2. In your GitHub repo, click "Add file" → "Upload files"
3. Drag all the folders/files into the upload area
4. Write commit message: "Initial commit - RAG chatbot starter"
5. Click "Commit changes"

---

### STEP 2: Get API Keys (15 minutes)

#### OpenAI API Key:

1. Go to https://platform.openai.com
2. Sign up or log in
3. Click "API keys" in left sidebar
4. Click "Create new secret key"
5. Name it: "RAG Chatbot"
6. Copy the key (starts with `sk-...`)
7. **Save it in a safe place** (you won't see it again!)
8. Go to "Settings" → "Billing" → Add $5-10 credit

#### Pinecone API Key:

1. Go to https://app.pinecone.io
2. Sign up (free tier is fine)
3. You'll see your API key on the dashboard
4. Copy it
5. **Save it in a safe place**

#### Create Pinecone Index:

1. In Pinecone dashboard, click "Indexes"
2. Click "Create Index"
3. Settings:
   - **Name**: `docs`
   - **Dimensions**: `1536`
   - **Metric**: `cosine`
   - **Region**: (pick closest to you)
4. Click "Create Index"
5. Wait 1-2 minutes for it to be ready

---

### STEP 3: Deploy to Vercel (10 minutes)

1. Go to https://vercel.com
2. Click "Sign Up" → Continue with GitHub
3. Authorize Vercel to access your GitHub
4. Click "Add New..." → "Project"
5. Find your repo in the list
6. Click "Import"

#### Configure the Project:

1. Framework: Should auto-detect "Next.js" ✅
2. Root Directory: Leave as `.` ✅
3. **Environment Variables** - Click "Environment Variables":

Add these three:

```
Name: OPENAI_API_KEY
Value: [paste your OpenAI key starting with sk-...]

Name: PINECONE_API_KEY  
Value: [paste your Pinecone key]

Name: PINECONE_INDEX
Value: docs
```

4. Click "Deploy"

**Wait 2-3 minutes...**

Your site will be live! 🎉

---

### STEP 4: Test Your Chatbot (5 minutes)

1. Vercel will show you a URL like: `your-project.vercel.app`
2. Click "Visit" to open it
3. You'll see the AI Assistant interface
4. Click "Upload Data" in the top right

**Before you can ask questions, you need to upload some data!**

---

## 📤 UPLOADING YOUR TEXT MESSAGES

### Prepare Your Data:

1. Export your text messages (see guide below)
2. Save as a `.txt` file
3. Clean it up:
   - Remove phone numbers
   - Remove addresses
   - Remove sensitive info
   
**Format example:**
```
Conversation with Sarah - January 2024

[2024-01-15] Me: Want to grab coffee next week?
[2024-01-15] Sarah: Sure! When works for you?
[2024-01-16] Me: How about Tuesday at 3pm?
[2024-01-16] Sarah: Perfect, see you then!

Conversation with Mom - January 2024

[2024-01-20] Mom: How was the interview?
[2024-01-20] Me: It went really well! They said they'll let me know by Friday.
```

### Upload to Your Chatbot:

1. Go to `your-project.vercel.app/upload`
2. Click "Choose File"
3. Select your text file
4. Click "Upload File"
5. Wait for processing (could take 1-5 minutes depending on size)
6. You'll see: "✅ Success! Processed X chunks"

---

## 💬 ASKING QUESTIONS

Go back to the home page and try:

**Basic Questions:**
- "When did I last talk to Sarah?"
- "What did I tell Mom about the interview?"
- "Find all mentions of coffee"

**Personality Analysis:**
- "Analyze my personality based on my messages"
- "What kind of person am I based on my texting style?"
- "What patterns do you see in my conversations?"
- "Do I communicate differently with different people?"

---

## 🔧 EDITING YOUR CODE

### Using GitHub.dev (VS Code in Browser):

1. Go to your GitHub repo
2. Press the `.` (period) key
3. GitHub.dev opens (VS Code in browser!)
4. Edit any file
5. Click Source Control icon (left sidebar)
6. Write commit message
7. Click checkmark ✓
8. Click "Sync Changes"
9. Vercel automatically redeploys (30 seconds)

---

## 🐛 TROUBLESHOOTING

### "Module not found" error on Vercel:

**Solution:**
1. Go to your repo on github.com
2. Click green "Code" button → "Codespaces" → "Create codespace"
3. Wait for it to load
4. Terminal will appear at bottom
5. Type: `npm install`
6. Wait for it to finish
7. In the left sidebar (Source Control), commit changes
8. Close codespace
9. Vercel will redeploy automatically

### "Pinecone index not found":

- Make sure you created an index named exactly `docs`
- Check that dimensions = 1536
- Wait a few minutes after creating (it takes time to initialize)

### "OpenAI API error":

- Verify your API key is correct
- Check you added billing/credits in OpenAI dashboard
- Make sure key is added to Vercel environment variables

### "No results found" when asking questions:

- Make sure you uploaded data first
- Check that upload was successful (look for success message)
- Try asking simpler, more specific questions

---

## 💰 COSTS

**During development/learning:**
- Vercel: FREE
- Pinecone: FREE (free tier)
- OpenAI: ~$5-10 for testing

**Per month running:**
- Small usage (100 queries): ~$2-5
- Medium usage (1000 queries): ~$20-40
- Everything is pay-as-you-go (no minimums)

---

## 📱 EXPORTING TEXT MESSAGES

### iPhone (iMessage):

**Paid option ($40):**
- Download iMazing or iExplorer
- Connect iPhone
- Export messages to text file

**Free option:**
- Forward conversations to yourself via email
- Copy/paste into text file
- Tedious but works

### Android:

**Free option:**
- Install "SMS Backup & Restore" app
- Backup to XML
- Convert to text using online converter

---

## 🎯 NEXT STEPS

Once it's working:

1. **Add more data:**
   - Upload email archives
   - Upload notes
   - Upload journal entries

2. **Improve personality analysis:**
   - Edit `app/api/chat/route.ts`
   - Add better prompts
   - Make it more insightful

3. **Customize the UI:**
   - Edit `app/page.tsx`
   - Change colors, layout
   - Add features

4. **Show it off:**
   - Share your Vercel URL with friends
   - Use it as a portfolio piece
   - Build similar tools for clients

---

## 📞 NEED HELP?

If you get stuck:

1. Check the error message carefully
2. Google the exact error
3. Check Vercel deployment logs
4. Check OpenAI/Pinecone dashboards for issues

**Common issues are usually:**
- API keys not set correctly
- Pinecone index not created
- npm packages not installed

---

**You've got this! Start with Step 1 and work through methodically. In 45 minutes you'll have a working AI chatbot!** 🚀

# AI RAG Chatbot Starter

A simple RAG (Retrieval Augmented Generation) chatbot built with Next.js, OpenAI, and Pinecone.

## What is RAG?

RAG = Retrieval Augmented Generation

Instead of the AI making up answers, it:
1. Searches your documents for relevant information
2. Sends that information to GPT/Claude
3. Gets an accurate answer based on YOUR data

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get API Keys

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Copy it

**Pinecone:**
1. Go to https://app.pinecone.io/
2. Sign up (free tier available)
3. Create a new index:
   - Name: `docs`
   - Dimensions: `1536`
   - Metric: `cosine`
4. Copy your API key

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your keys:

```
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX=docs
```

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Project Settings > Environment Variables
```

## How to Use

### Upload Documents

Create an upload UI or use the API directly:

```bash
curl -X POST http://localhost:3000/api/embed \
  -F "file=@your-document.txt"
```

### Ask Questions

Use the web interface or call the API:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is this about?"}'
```

## Architecture

```
User Question
    ↓
Next.js Frontend (Vercel)
    ↓
API Route (/api/chat)
    ↓
1. Embed question (OpenAI)
2. Search docs (Pinecone)
3. Generate answer (OpenAI + context)
    ↓
Return answer to user
```

## Cost Estimate

For a small business chatbot (1000 questions/month):

- OpenAI embeddings: ~$0.10
- OpenAI GPT-4: ~$30
- Pinecone: Free (or $70/mo for production)
- Vercel: Free (or $20/mo for production)

**Total: ~$30-120/month**

You can charge clients $500-2000/month → 80-95% margins!

## Next Steps

1. **Add file upload UI** - Let users upload docs via web interface
2. **Improve chunking** - Use semantic chunking for better results
3. **Add chat history** - Store conversations
4. **Multi-user support** - Separate data per user
5. **Analytics** - Track questions, answers, usage
6. **Custom branding** - White-label for clients

## Learning Resources

- **LangChain docs**: https://js.langchain.com/docs/
- **Pinecone docs**: https://docs.pinecone.io/
- **OpenAI embeddings**: https://platform.openai.com/docs/guides/embeddings
- **Vercel deployment**: https://vercel.com/docs

## Common Issues

**"Pinecone index not found"**
- Make sure you created an index named "docs" in Pinecone dashboard
- Check that dimensions = 1536

**"OpenAI API error"**
- Verify your API key is correct
- Check you have credits/billing set up

**"No relevant documents found"**
- Upload documents first using `/api/embed`
- Make sure embeddings were stored successfully

## Production Checklist

Before deploying for clients:

- [ ] Add authentication
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Add error handling
- [ ] Create backup strategy
- [ ] Add usage analytics
- [ ] Create admin dashboard
- [ ] Set up billing/subscriptions

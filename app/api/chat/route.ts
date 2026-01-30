import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { NextRequest, NextResponse } from 'next/server';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || ''
});

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    // 1. Create embedding for the question
    const questionEmbedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question
    });

    // 2. Search Pinecone for relevant documents
    const index = pinecone.index('docs');
    
    const searchResults = await index.query({
      vector: questionEmbedding.data[0].embedding,
      topK: 3,
      includeMetadata: true
    });

    // 3. Build context from search results
    const context = searchResults.matches
      .map((match: any) => match.metadata?.text || '')
      .join('\n\n');

    // 4. Generate answer using GPT with context
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
{
  role: "system",
  content: `You are a brutally honest personality analyst.

CRITICAL: In the context below, only analyze messages labeled "Me" - these are from the person requesting analysis. Ignore messages from "Contact" or phone numbers (those are other people talking TO them). Focus exclusively on how the "Me" person communicates.

CONTEXT (their actual messages):
${context}

ANALYSIS GUIDELINES:

Be ruthlessly honest:
- Call out narcissistic tendencies, people-pleasing, avoidance, manipulation
- Identify patterns they might not want to see (neediness, defensiveness, ego)
- Point out contradictions between what they say and how they act
- Notice passive-aggressive behavior, deflection, or emotional immaturity

Be specific:
- Quote actual messages as evidence
- "You said X, which shows Y pattern"
- Compare how they talk to different people
- Note what they avoid talking about

Look for:
- Insecurities masked as confidence (or vice versa)
- How they handle conflict vs. avoid it
- Whether they listen or just wait to talk
- Patterns of seeking validation
- Signs of anxiety, control issues, or emotional unavailability
- How they treat people (entitled? grateful? demanding?)
- Their self-awareness level (do they reflect or just react?)

Don't sugarcoat:
- If they're self-absorbed, say it
- If they're insecure, name it
- If they're avoiding something, point it out
- If they have blind spots, expose them

Be constructive:
- After harsh truth, explain WHY the pattern exists
- Suggest what it reveals about their deeper psychology
- Frame it as "here's what you might not realize about yourself"

For factual questions:
- Answer directly with specific message references

Remember: They ASKED for this analysis. They want real insights, not platitudes. Be the honest friend who tells them what everyone else is too polite to say.`
},
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return NextResponse.json({
      answer: completion.choices[0].message.content,
      sources: searchResults.matches.length
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process question' },
      { status: 500 }
    );
  }
}

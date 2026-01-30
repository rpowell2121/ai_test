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
          content: `You are a helpful assistant. Answer questions based on this context:

${context}

If the context doesn't contain relevant information, say so.`
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

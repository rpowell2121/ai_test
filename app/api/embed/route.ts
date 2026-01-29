import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { NextRequest, NextResponse } from 'next/server';

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || ''
});

// Split text into chunks
function splitIntoChunks(text: string, chunkSize: number = 500): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  
  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();
    
    // Split into chunks
    const chunks = splitIntoChunks(text, 500);
    
    console.log(`Processing ${chunks.length} chunks...`);

    // Create embeddings for each chunk
    const embeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk
        });
        return response.data[0].embedding;
      })
    );

    // Store in Pinecone
    const index = pinecone.index(process.env.PINECONE_INDEX || 'docs');
    
    const vectors = embeddings.map((embedding, i) => ({
      id: `${file.name}-chunk-${i}`,
      values: embedding,
      metadata: {
        text: chunks[i],
        filename: file.name,
        chunkIndex: i
      }
    }));

    await index.upsert(vectors);

    return NextResponse.json({
      success: true,
      message: `Processed ${chunks.length} chunks from ${file.name}`
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process document' },
      { status: 500 }
    );
  }
}

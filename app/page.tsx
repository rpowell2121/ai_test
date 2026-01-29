'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setAnswer('');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setAnswer(`Error: ${data.error}`);
      } else {
        setAnswer(data.answer || 'No answer received');
      }
    } catch (error) {
      setAnswer('Error: Failed to get response. Make sure you uploaded data first.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <Link 
          href="/upload" 
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm"
        >
          📤 Upload Data
        </Link>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Ask a question:
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && askQuestion()}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What would you like to know?"
            disabled={loading}
          />
        </div>
        
        <button
          onClick={askQuestion}
          disabled={loading || !question.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
        
        {answer && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2 text-gray-700">Answer:</h3>
            <p className="whitespace-pre-wrap text-gray-900">{answer}</p>
          </div>
        )}

        {!answer && !loading && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2 text-blue-900">Getting Started:</h3>
            <ol className="text-sm text-blue-800 space-y-2">
              <li>1. Click "Upload Data" above to add your text messages or documents</li>
              <li>2. Wait for processing to complete</li>
              <li>3. Come back here and ask questions about your data</li>
            </ol>
          </div>
        )}
      </div>

      <div className="mt-12 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <p className="font-semibold mb-2">Example questions:</p>
        <ul className="space-y-1">
          <li>• "When did I last talk to Sarah about coffee?"</li>
          <li>• "What did I say about my job interview?"</li>
          <li>• "Analyze my personality based on my messages"</li>
          <li>• "What topics do I talk about most?"</li>
        </ul>
      </div>
    </main>
  );
}

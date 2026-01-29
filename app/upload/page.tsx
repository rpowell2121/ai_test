'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus('Processing your file...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/embed', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus(`✅ Success! Processed ${data.message}`);
      } else {
        setStatus(`❌ Error: ${data.error || 'Upload failed'}`);
      }
    } catch (error) {
      setStatus('❌ Error: Failed to upload file');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Upload Your Data</h1>
      <p className="text-gray-600 mb-8">
        Upload your text messages, notes, or any text file to add to the knowledge base.
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".txt,.csv,.json"
          className="mb-4"
        />

        {file && (
          <div className="mb-4 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>

      {status && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="whitespace-pre-wrap">{status}</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Tips:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Text files (.txt) work best</li>
          <li>• Clean your data first (remove phone numbers, addresses)</li>
          <li>• Larger files take longer to process</li>
          <li>• After uploading, go back to the <a href="/" className="text-blue-600 underline">home page</a> to chat</li>
        </ul>
      </div>
    </main>
  );
}

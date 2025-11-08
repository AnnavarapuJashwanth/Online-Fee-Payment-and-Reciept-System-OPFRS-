import React from 'react';

export default function EnvTest() {
  const apiBase = import.meta.env.VITE_API_BASE;
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🔍 Environment Variable Test</h1>
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
        <p><strong>VITE_API_BASE:</strong> {apiBase || 'NOT SET'}</p>
        <p><strong>Expected:</strong> http://localhost:5000/api</p>
        <p><strong>Status:</strong> {apiBase === 'http://localhost:5000/api' ? '✅ CORRECT' : '❌ WRONG'}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>All Environment Variables:</h3>
        <pre style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', fontSize: '12px' }}>
          {JSON.stringify(import.meta.env, null, 2)}
        </pre>
      </div>
    </div>
  );
}

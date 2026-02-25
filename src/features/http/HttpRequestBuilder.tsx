import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Send, 
  Plus, 
  Trash2, 
  History, 
  Save, 
  AlertTriangle,
  ChevronDown,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { openDB } from 'idb';

interface Request {
  id: string;
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  body: string;
  timestamp: number;
}

export const HttpRequestBuilder: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Request[]>([]);

  // DB Setup
  useEffect(() => {
    const initDB = async () => {
      const db = await openDB('devstation-http', 1, {
        upgrade(db) {
          db.createObjectStore('history', { keyPath: 'id' });
        },
      });
      const allHistory = await db.getAll('history');
      setHistory(allHistory.sort((a, b) => b.timestamp - a.timestamp));
    };
    initDB();
  }, []);

  const handleSend = async () => {
    if (!url) return;
    setLoading(true);
    setResponse(null);

    try {
      const headerObj: Record<string, string> = {};
      headers.forEach(h => {
        if (h.key) headerObj[h.key] = h.value;
      });

      const startTime = performance.now();
      const res = await fetch(url, {
        method,
        headers: headerObj,
        body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
      });
      const endTime = performance.now();

      const data = await res.json().catch(() => res.text());
      
      const result = {
        status: res.status,
        statusText: res.statusText,
        time: Math.round(endTime - startTime),
        headers: Object.fromEntries(res.headers.entries()),
        data,
      };
      
      setResponse(result);

      // Save to history
      const newReq: Request = {
        id: Math.random().toString(36).substring(7),
        method,
        url,
        headers,
        body,
        timestamp: Date.now(),
      };
      
      const db = await openDB('devstation-http', 1);
      await db.put('history', newReq);
      setHistory(prev => [newReq, ...prev].slice(0, 50));

    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (index: number) => setHeaders(headers.filter((_, i) => i !== index));
  const updateHeader = (index: number, field: 'key' | 'value', val: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = val;
    setHeaders(newHeaders);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      {/* URL Bar */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="appearance-none bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-bold rounded-l-md px-4 py-2 pr-10 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer h-10"
            >
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/resource"
            className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-4 h-10 outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={loading || !url}
            className="flex items-center gap-2 px-6 h-10 rounded-r-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
            Send
          </button>
        </div>
        
        <div className="mt-3 flex items-center gap-2 text-[10px] text-amber-500 bg-amber-500/5 border border-amber-500/10 px-3 py-1.5 rounded-md">
          <AlertTriangle size={12} />
          <span>CORS Warning: Browser requests are subject to CORS policies. If the server doesn't allow your origin, the request will fail.</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Config */}
        <div className="w-1/2 flex flex-col border-r border-zinc-800">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Headers */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Headers</h3>
                <button onClick={addHeader} className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300">
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-2">
                {headers.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      placeholder="Key"
                      value={h.key}
                      onChange={(e) => updateHeader(i, 'key', e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 text-xs px-3 py-1.5 rounded outline-none focus:border-zinc-600"
                    />
                    <input
                      placeholder="Value"
                      value={h.value}
                      onChange={(e) => updateHeader(i, 'value', e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 text-xs px-3 py-1.5 rounded outline-none focus:border-zinc-600"
                    />
                    <button onClick={() => removeHeader(i)} className="p-1.5 text-zinc-600 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Body */}
            {(method !== 'GET' && method !== 'HEAD') && (
              <section className="flex-1 flex flex-col min-h-[200px]">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Body (JSON)</h3>
                <div className="flex-1 border border-zinc-800 rounded-md overflow-hidden">
                  <Editor
                    height="100%"
                    language="json"
                    theme="vs-dark"
                    value={body}
                    onChange={(val) => setBody(val || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 12,
                      fontFamily: 'JetBrains Mono',
                      automaticLayout: true,
                    }}
                  />
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Right Panel: Response */}
        <div className="w-1/2 flex flex-col bg-zinc-900/20">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Response</span>
              {response && !response.error && (
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded",
                    response.status >= 200 && response.status < 300 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="text-xs text-zinc-500">{response.time}ms</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {response ? (
              response.error ? (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <AlertTriangle size={32} className="text-red-500 mb-4" />
                  <h4 className="text-sm font-bold text-zinc-300 mb-1">Request Failed</h4>
                  <p className="text-xs text-zinc-500 max-w-xs">{response.error}</p>
                </div>
              ) : (
                <Editor
                  height="100%"
                  language="json"
                  theme="vs-dark"
                  value={typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono',
                    readOnly: true,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-700">
                <History size={48} className="mb-4 opacity-10" />
                <p className="text-sm italic">Send a request to see the response</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

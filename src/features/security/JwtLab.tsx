import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import dayjs from 'dayjs';

export const JwtLab: React.FC = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) {
      setHeader('');
      setPayload('');
      setError(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');

      const decodedHeader = JSON.parse(atob(parts[0]));
      const decodedPayload = JSON.parse(atob(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setHeader('');
      setPayload('');
    }
  }, [token]);

  const getExpiration = () => {
    try {
      const p = JSON.parse(payload);
      if (p.exp) {
        const exp = dayjs.unix(p.exp);
        const isExpired = exp.isBefore(dayjs());
        return {
          time: exp.format('YYYY-MM-DD HH:mm:ss'),
          relative: exp.fromNow(),
          isExpired
        };
      }
    } catch (e) {}
    return null;
  };

  const exp = getExpiration();

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      <div className="flex-1 flex divide-x divide-zinc-800">
        {/* Input */}
        <div className="w-1/2 flex flex-col">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Encoded Token</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(token);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-zinc-500 hover:text-zinc-300"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="flex-1 p-4">
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your JWT here..."
              className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm text-indigo-400 placeholder:text-zinc-800 break-all"
            />
          </div>
        </div>

        {/* Decoded */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Decoded</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {error ? (
              <div className="flex flex-col items-center justify-center py-12 text-red-500/50">
                <AlertCircle size={48} className="mb-4" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            ) : !token ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-800">
                <Shield size={48} className="mb-4" />
                <p className="text-sm italic">Paste a token to decode it</p>
              </div>
            ) : (
              <>
                {/* Status */}
                <div className="flex items-center gap-4">
                  {exp && (
                    <div className={cn(
                      "flex-1 p-3 rounded-xl border flex items-center gap-3",
                      exp.isExpired ? "bg-red-500/5 border-red-500/20 text-red-400" : "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    )}>
                      {exp.isExpired ? <Unlock size={18} /> : <Lock size={18} />}
                      <div className="flex-1">
                        <div className="text-[10px] font-bold uppercase opacity-50">Status</div>
                        <div className="text-sm font-bold">{exp.isExpired ? 'Expired' : 'Valid (Time)'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase opacity-50">Expires</div>
                        <div className="text-xs font-mono">{exp.relative}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Header */}
                <section>
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Header</h3>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-pink-400 whitespace-pre-wrap">
                    {header}
                  </div>
                </section>

                {/* Payload */}
                <section>
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Payload</h3>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-sky-400 whitespace-pre-wrap">
                    {payload}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

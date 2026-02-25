import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const RegexTester: React.FC = () => {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regex || !text) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const re = new RegExp(regex, flags);
      const allMatches = Array.from(text.matchAll(re));
      setMatches(allMatches);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [regex, flags, text]);

  const highlightText = () => {
    if (!regex || !text || error) return text;
    try {
      const re = new RegExp(regex, flags);
      const parts = text.split(re);
      // This is a bit complex for a simple highlight, let's just show match count for now
      return text;
    } catch (e) {
      return text;
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">/</span>
            <input
              type="text"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              placeholder="Enter regex pattern..."
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm pl-6 pr-4 h-10 rounded-md outline-none focus:border-indigo-500 font-mono"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">/</span>
          </div>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="flags"
            className="w-20 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-3 h-10 rounded-md outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/5 border border-red-500/10 px-3 py-1.5 rounded-md">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex divide-x divide-zinc-800 overflow-hidden">
        {/* Input */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Test String</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to test against..."
            className="flex-1 bg-transparent p-4 outline-none resize-none font-mono text-sm text-zinc-400 placeholder:text-zinc-800"
          />
        </div>

        {/* Results */}
        <div className="w-1/3 flex flex-col bg-zinc-900/10">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Matches ({matches.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {matches.length > 0 ? (
              matches.map((match, i) => (
                <div key={i} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Match {i + 1}</span>
                    <span className="text-[10px] text-zinc-600 font-mono">Index: {match.index}</span>
                  </div>
                  <div className="text-xs font-mono text-zinc-300 break-all bg-zinc-950 p-2 rounded border border-zinc-800">
                    {match[0]}
                  </div>
                  {match.length > 1 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Groups</div>
                      {Array.from(match).slice(1).map((group, j) => (
                        <div key={j} className="text-[10px] font-mono text-zinc-500 pl-2 border-l border-zinc-800">
                          ${j + 1}: {group}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-800">
                <Search size={48} className="mb-4 opacity-10" />
                <p className="text-sm italic">No matches found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

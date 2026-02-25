import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Hash, 
  RefreshCw, 
  Copy, 
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

export const SecurityTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hashing' | 'jwt' | 'generators'>('hashing');
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({ sha256: '', sha1: '', md5: '' });
  const [copied, setCopied] = useState<string | null>(null);

  // Generators State
  const [passLength, setPassLength] = useState(16);
  const [generatedPass, setGeneratedPass] = useState('');
  const [uuid, setUuid] = useState('');
  const [nanoId, setNanoId] = useState('');

  const handleHash = async () => {
    if (!input) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    // SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    setHashes(prev => ({ ...prev, sha256: hashHex }));
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let retVal = "";
    for (let i = 0, n = charset.length; i < passLength; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setGeneratedPass(retVal);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex items-center px-4 border-b border-zinc-800 bg-zinc-900/30">
        <button
          onClick={() => setActiveTab('hashing')}
          className={cn(
            "px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2",
            activeTab === 'hashing' ? "border-indigo-500 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Hashing
        </button>
        <button
          onClick={() => setActiveTab('generators')}
          className={cn(
            "px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2",
            activeTab === 'generators' ? "border-indigo-500 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          Generators
        </button>
        <button
          onClick={() => setActiveTab('jwt')}
          className={cn(
            "px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2",
            activeTab === 'jwt' ? "border-indigo-500 text-zinc-100" : "border-transparent text-zinc-500 hover:text-zinc-300"
          )}
        >
          JWT Lab
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {activeTab === 'hashing' && (
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                  <Hash size={16} className="text-zinc-500" />
                  Input Data
                </h3>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter text to hash..."
                  className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm font-mono text-zinc-300 outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  onClick={handleHash}
                  className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-md transition-all shadow-lg shadow-indigo-500/20"
                >
                  Generate Hashes
                </button>
              </section>

              <section className="space-y-4">
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">SHA-256</span>
                    <button onClick={() => handleCopy(hashes.sha256, 'sha256')} className="text-zinc-500 hover:text-zinc-300">
                      {copied === 'sha256' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="text-xs font-mono text-zinc-300 break-all bg-zinc-950 p-2 rounded border border-zinc-800">
                    {hashes.sha256 || '...'}
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'generators' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Gen */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">
                <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                  <Lock size={16} className="text-zinc-500" />
                  Password Generator
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Length: {passLength}</span>
                  </div>
                  <input 
                    type="range" min="8" max="64" value={passLength} 
                    onChange={(e) => setPassLength(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-300 truncate">
                    {generatedPass || 'Click generate'}
                  </div>
                  <button onClick={generatePassword} className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    <RefreshCw size={16} />
                  </button>
                  <button onClick={() => handleCopy(generatedPass, 'pass')} className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    {copied === 'pass' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* UUID Gen */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">
                <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                  <Key size={16} className="text-zinc-500" />
                  UUID v4
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-300 truncate">
                    {uuid || '...'}
                  </div>
                  <button onClick={() => setUuid(uuidv4())} className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    <RefreshCw size={16} />
                  </button>
                  <button onClick={() => handleCopy(uuid, 'uuid')} className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    {copied === 'uuid' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* NanoID Gen */}
              <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">
                <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                  <Shield size={16} className="text-zinc-500" />
                  NanoID
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-300 truncate">
                    {nanoId || '...'}
                  </div>
                  <button onClick={() => setNanoId(nanoid())} className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    <RefreshCw size={16} />
                  </button>
                  <button onClick={() => handleCopy(nanoId, 'nanoid')} className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    {copied === 'nanoid' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jwt' && (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
              <Lock size={48} className="mb-4 opacity-20" />
              <p>JWT Lab is coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

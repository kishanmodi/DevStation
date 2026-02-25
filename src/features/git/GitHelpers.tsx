import React, { useState } from 'react';
import { GitCommit, FileCode, Copy, Check, RefreshCw, Terminal } from 'lucide-react';
import { cn } from '../../lib/utils';

const COMMIT_TYPES = [
  { id: 'feat', label: 'Feature', description: 'A new feature' },
  { id: 'fix', label: 'Fix', description: 'A bug fix' },
  { id: 'docs', label: 'Docs', description: 'Documentation only changes' },
  { id: 'style', label: 'Style', description: 'Changes that do not affect the meaning of the code' },
  { id: 'refactor', label: 'Refactor', description: 'A code change that neither fixes a bug nor adds a feature' },
  { id: 'perf', label: 'Perf', description: 'A code change that improves performance' },
  { id: 'test', label: 'Test', description: 'Adding missing tests or correcting existing tests' },
  { id: 'chore', label: 'Chore', description: 'Changes to the build process or auxiliary tools' },
];

export const GitHelpers: React.FC = () => {
  const [type, setType] = useState('feat');
  const [scope, setScope] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);

  const commitMessage = `${type}${scope ? `(${scope})` : ''}: ${subject}${body ? `\n\n${body}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(commitMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <section className="space-y-6">
          <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
            <GitCommit size={16} className="text-zinc-500" />
            Conventional Commit Generator
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMIT_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={cn(
                        "px-3 py-2 text-left rounded-md border text-xs transition-all",
                        type === t.id ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      )}
                    >
                      <div className="font-bold">{t.id}</div>
                      <div className="opacity-50 text-[10px] truncate">{t.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Scope (Optional)</label>
                <input
                  type="text"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="e.g. auth, api, ui"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-300 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short description of the change"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-300 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4 flex flex-col">
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Preview</label>
                <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap relative group">
                  {commitMessage}
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleCopy}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
              >
                Copy Commit Message
              </button>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
              <FileCode size={16} className="text-zinc-500" />
              .gitignore Generator
            </h3>
            <span className="text-[10px] text-zinc-500 italic">Coming soon: Select your stack</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-500">
            # Standard Node.js gitignore<br/>
            node_modules/<br/>
            dist/<br/>
            .env<br/>
            *.log<br/>
            .DS_Store
          </div>
        </section>
      </div>
    </div>
  );
};

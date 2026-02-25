import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Variable, 
  Copy, 
  Check, 
  FileJson, 
  Terminal,
  AlertCircle,
  Download
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const EnvEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [duplicates, setDuplicates] = useState<string[]>([]);

  const handleCheck = () => {
    const lines = content.split('\n');
    const keys = new Set<string>();
    const dups = new Set<string>();

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const key = trimmed.split('=')[0]?.trim();
        if (key) {
          if (keys.has(key)) dups.add(key);
          keys.add(key);
        }
      }
    });
    setDuplicates(Array.from(dups));
  };

  const toDocker = () => {
    const lines = content.split('\n');
    const result = lines
      .filter(l => l.trim() && !l.trim().startsWith('#'))
      .map(l => l.trim())
      .join('\n');
    setContent(result);
  };

  const toJson = () => {
    const lines = content.split('\n');
    const obj: Record<string, string> = {};
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valParts] = trimmed.split('=');
        if (key) obj[key.trim()] = valParts.join('=').trim();
      }
    });
    setContent(JSON.stringify(obj, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCheck}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all"
          >
            <AlertCircle size={14} />
            Check Duplicates
          </button>
          <button
            onClick={toDocker}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all"
          >
            <Terminal size={14} />
            Docker Env
          </button>
          <button
            onClick={toJson}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-all"
          >
            <FileJson size={14} />
            To JSON
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              copied ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {duplicates.length > 0 && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle size={14} />
          <span>Found duplicate variables: {duplicates.join(', ')}</span>
        </div>
      )}

      <div className="flex-1 relative">
        <Editor
          height="100%"
          language="ini"
          theme="vs-dark"
          value={content}
          onChange={(val) => setContent(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
};

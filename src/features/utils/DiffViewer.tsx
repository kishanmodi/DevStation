import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Split, Copy, Check, Trash2, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'json', label: 'JSON' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'markdown', label: 'Markdown' },
];

export const DiffViewer: React.FC = () => {
  const originalRef = React.useRef<any>(null);
  const modifiedRef = React.useRef<any>(null);
  const [language, setLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (modifiedRef.current) {
      navigator.clipboard.writeText(modifiedRef.current.getValue());
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (originalRef.current) originalRef.current.setValue('');
    if (modifiedRef.current) modifiedRef.current.setValue('');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            <Split size={14} />
            Diff Viewer
          </div>
          <div className="relative group">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded-md px-3 py-1.5 pr-8 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
            title="Clear All"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={handleCopy}
            disabled={!(modifiedRef.current && modifiedRef.current.getValue())}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              copied ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Modified'}
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <DiffEditor
          height="100%"
          language={language}
          original=""
          modified=""
          theme="vs-dark"
          onMount={(editor) => {
            originalRef.current = editor.getOriginalEditor();
            modifiedRef.current = editor.getModifiedEditor();
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
            renderSideBySide: true,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            originalEditable: true,
          }}
        />
      </div>
    </div>
  );
};

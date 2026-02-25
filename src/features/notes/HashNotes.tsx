import React, { useState, useEffect, useCallback } from 'react';
import LZString from 'lz-string';
import { Copy, Download, FileUp, Hash, Info, Trash2 } from 'lucide-react';
import { cn, formatBytes } from '../../lib/utils';

interface HashNotesProps {
  tabId: string;
  initialData?: { initialContent?: string };
}

export const HashNotes: React.FC<HashNotesProps> = ({ tabId, initialData }) => {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Initialize content from hash if provided
  useEffect(() => {
    if (initialData?.initialContent) {
      try {
        const decoded = LZString.decompressFromEncodedURIComponent(initialData.initialContent);
        if (decoded) setContent(decoded);
      } catch (e) {
        console.error('Failed to decode note content', e);
      }
    }
  }, [initialData]);

  // Update URL hash (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        const compressed = LZString.compressToEncodedURIComponent(content);
        const newUrl = `${window.location.origin}/#/note/${compressed}`;
        setUrl(newUrl);
        // We don't want to update window.location.hash constantly to avoid history pollution
        // but we show it in the UI
      } else {
        setUrl('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [content]);

  const handleCopyLink = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') setContent(text);
    };
    reader.readAsText(file);
  };

  const charCount = content.length;
  const isTooLong = url.length > 2000; // Browser URL limit safety

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs text-zinc-400">
            <Hash size={14} />
            <span>Hash Note</span>
          </div>
          <div className="h-4 w-px bg-zinc-800 mx-2" />
          <span className="text-xs text-zinc-500 font-mono">
            {charCount} chars {content && `(~${formatBytes(new Blob([content]).size)})`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            disabled={!content}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              copied ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
              !content && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          
          <button
            onClick={handleExport}
            disabled={!content}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors disabled:opacity-50"
            title="Export to Markdown"
          >
            <Download size={18} />
          </button>

          <label className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer">
            <FileUp size={18} />
            <input type="file" className="hidden" onChange={handleImport} accept=".txt,.md" />
          </label>

          <button
            onClick={() => setContent('')}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
            title="Clear"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* URL Warning */}
      {isTooLong && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-xs text-amber-500">
          <Info size={14} />
          <span>Warning: The URL is getting very long ({url.length} chars). Some browsers or servers might truncate it.</span>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 p-4 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your note here... Everything is stored in the URL hash."
          className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm text-zinc-300 placeholder:text-zinc-700 leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-1.5 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          Serverless Storage via URL Hash
        </div>
        {url && (
          <div className="text-[10px] text-zinc-500 truncate max-w-md font-mono opacity-50">
            {url}
          </div>
        )}
      </div>
    </div>
  );
};

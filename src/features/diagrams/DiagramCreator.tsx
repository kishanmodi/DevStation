import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import Editor from '@monaco-editor/react';
import { 
  Share2, 
  Download, 
  Maximize2, 
  RefreshCw,
  Layout
} from 'lucide-react';
import { cn } from '../../lib/utils';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'strict',
  fontFamily: 'Inter'
});

const DEFAULT_DIAGRAM = `graph TD
    A[User] -->|Requests| B(Load Balancer)
    B --> C{Auth?}
    C -->|Yes| D[API Server]
    C -->|No| E[Login Page]
    D --> F[(Database)]
    D --> G[Cache]`;

export const DiagramCreator: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_DIAGRAM);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const renderDiagram = async () => {
    if (!code.trim()) return;
    try {
      const { svg } = await mermaid.render('mermaid-diagram', code);
      setSvg(svg);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(renderDiagram, 500);
    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      <div className="flex-1 flex divide-x divide-zinc-800">
        {/* Editor */}
        <div className="w-1/3 flex flex-col">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mermaid Syntax</span>
            <button onClick={renderDiagram} className="text-zinc-500 hover:text-zinc-300">
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language="markdown"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
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

        {/* Preview */}
        <div className="flex-1 flex flex-col bg-zinc-900/10 overflow-hidden">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preview</span>
            <div className="flex items-center gap-3">
              <button className="text-zinc-500 hover:text-zinc-300">
                <Download size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-12 flex items-center justify-center bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:20px_20px]">
            {error ? (
              <div className="max-w-md p-4 bg-red-500/5 border border-red-500/10 rounded-lg text-xs text-red-400 font-mono">
                {error}
              </div>
            ) : (
              <div 
                className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-2xl"
                dangerouslySetInnerHTML={{ __html: svg }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

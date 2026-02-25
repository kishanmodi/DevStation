import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  FileText, 
  Download, 
  Eye, 
  Code,
  Layout
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const MdToPdf: React.FC = () => {
  const [md, setMd] = useState('# Project Documentation\n\n## Introduction\nThis is a sample markdown document.\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n### Code Example\n```javascript\nconsole.log("Hello World");\n```');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [showPrintWarning, setShowPrintWarning] = useState(false);

  const handlePrint = () => {
    setShowPrintWarning(true);
    setTimeout(() => setShowPrintWarning(false), 5000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden relative">
      {showPrintWarning && (
        <div className="absolute top-4 right-4 z-50 bg-amber-500 text-black px-4 py-2 rounded-lg shadow-2xl text-xs font-bold animate-bounce">
          ⚠️ Printing is disabled in the preview environment.
        </div>
      )}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setView('edit')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                view === 'edit' ? "bg-zinc-800 text-zinc-100 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Code size={14} />
              Editor
            </button>
            <button
              onClick={() => setView('preview')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                view === 'preview' ? "bg-zinc-800 text-zinc-100 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Eye size={14} />
              Preview
            </button>
          </div>

          {view === 'preview' && (
            <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setPreviewTheme('light')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all",
                  previewTheme === 'light' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
                )}
              >
                Light
              </button>
              <button
                onClick={() => setPreviewTheme('dark')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all",
                  previewTheme === 'dark' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
                )}
              >
                Dark
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 h-10 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-md transition-all shadow-lg shadow-indigo-500/20"
        >
          <Download size={16} />
          Export to PDF
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {view === 'edit' ? (
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="flex-1 bg-transparent p-8 outline-none resize-none font-mono text-sm text-zinc-400 placeholder:text-zinc-800 print:hidden"
            placeholder="Write your markdown here..."
          />
        ) : (
          <div className={cn(
            "flex-1 overflow-y-auto p-12 md:p-20 print:p-0 transition-colors duration-300",
            previewTheme === 'light' ? "bg-white" : "bg-zinc-900"
          )}>
            <div className={cn(
              "max-w-3xl mx-auto prose prose-zinc",
              previewTheme === 'dark' && "prose-invert"
            )}>
              <Markdown>{md}</Markdown>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .markdown-body, .markdown-body * { visibility: visible; }
          .markdown-body { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            padding: 2cm;
            color: black !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

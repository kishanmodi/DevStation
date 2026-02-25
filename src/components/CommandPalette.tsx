import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore, ToolId } from '../store/useAppStore';
import { 
  Search, 
  StickyNote, 
  Code2, 
  Braces, 
  Globe, 
  ShieldCheck, 
  GitBranch, 
  Variable, 
  FileText, 
  Wrench,
  Layout,
  Command,
  Split,
  Clock,
  Cloud,
  Share2,
  FileDown,
  Type,
  Palette,
  BarChart,
  Network
} from 'lucide-react';
import { cn } from '../lib/utils';

const TOOLS: { id: ToolId; label: string; icon: any }[] = [
  { id: 'notes', label: 'Hash Notes', icon: StickyNote },
  { id: 'formatter', label: 'Code Formatter', icon: Code2 },
  { id: 'json', label: 'JSON Toolkit', icon: Braces },
  { id: 'http', label: 'HTTP Client', icon: Globe },
  { id: 'security', label: 'JWT Lab', icon: ShieldCheck },
  { id: 'git', label: 'Git Helpers', icon: GitBranch },
  { id: 'env', label: 'Env Editor', icon: Variable },
  { id: 'logs', label: 'Log Viewer', icon: FileText },
  { id: 'utils', label: 'Regex Tester', icon: Search },
  { id: 'frontend', label: 'Responsive', icon: Layout },
  { id: 'system', label: 'Diff Viewer', icon: Split },
  { id: 'time', label: 'Time Tools', icon: Clock },
  { id: 'k8s', label: 'Kubernetes', icon: Cloud },
  { id: 'diagram', label: 'Diagrams', icon: Share2 },
  { id: 'md2pdf', label: 'MD to PDF', icon: FileDown },
  { id: 'lorem', label: 'Lorem Ipsum', icon: Type },
  { id: 'whiteboard', label: 'Whiteboard', icon: Palette },
  { id: 'charts', label: 'Chart Builder', icon: BarChart },
  { id: 'flow', label: 'Flow Builder', icon: Network },
];

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const addTab = useAppStore(state => state.addTab);

  const filteredTools = TOOLS.filter(t => 
    t.label.toLowerCase().includes(query.toLowerCase()) || 
    t.id.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelect = useCallback((tool: typeof TOOLS[0]) => {
    addTab(tool.id, tool.label);
    handleClose();
  }, [addTab, handleClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleOpen();
      }
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredTools.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === 'Enter') {
      if (filteredTools[selectedIndex]) {
        handleSelect(filteredTools[selectedIndex]);
      }
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[51] overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-zinc-800">
              <Search size={20} className="text-zinc-500 mr-3" />
              <input
                autoFocus
                placeholder="Search tools and commands... (Ctrl+K)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 text-base"
              />
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-[10px] text-zinc-500 font-bold">
                <Command size={10} />
                <span>K</span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSelect(tool)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "flex items-center w-full gap-3 px-3 py-3 rounded-xl transition-all text-left",
                      index === selectedIndex ? "bg-indigo-600 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    )}
                  >
                    <tool.icon size={18} className={cn(index === selectedIndex ? "text-white" : "text-zinc-500")} />
                    <span className="flex-1 font-medium">{tool.label}</span>
                    <span className="text-[10px] opacity-50 uppercase tracking-widest font-bold">Tool</span>
                  </button>
                ))
              ) : (
                <div className="py-12 text-center text-zinc-600">
                  <Search size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No tools found matching "{query}"</p>
                </div>
              )}
            </div>

            <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="px-1 rounded bg-zinc-900 border border-zinc-800">↑↓</span> Navigate</span>
                <span className="flex items-center gap-1"><span className="px-1 rounded bg-zinc-900 border border-zinc-800">Enter</span> Select</span>
              </div>
              <span>DevStation v1.0</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  ChevronDown,
  Terminal
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  stack?: string;
}

export const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const parsedLogs: LogEntry[] = logs.split('\n').filter(l => l.trim()).map((line, i) => {
    const lower = line.toLowerCase();
    let level: LogEntry['level'] = 'info';
    if (lower.includes('error')) level = 'error';
    else if (lower.includes('warn')) level = 'warn';
    else if (lower.includes('debug')) level = 'debug';

    return {
      id: i.toString(),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message: line
    };
  });

  const filteredLogs = parsedLogs.filter(l => {
    const matchesText = l.message.toLowerCase().includes(filter.toLowerCase());
    const matchesLevel = levelFilter === 'all' || l.level === levelFilter;
    return matchesText && matchesLevel;
  });

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter logs..."
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm pl-10 pr-4 h-10 rounded-md outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-4 h-10 rounded-md outline-none focus:border-indigo-500"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
          <button
            onClick={() => setLogs('')}
            className="p-2 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Input Area */}
        <div className="w-1/3 border-r border-zinc-800 flex flex-col">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Raw Logs Input</span>
          </div>
          <textarea
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
            placeholder="Paste your logs here..."
            className="flex-1 bg-transparent p-4 outline-none resize-none font-mono text-xs text-zinc-400 placeholder:text-zinc-800"
          />
        </div>

        {/* Viewer Area */}
        <div className="flex-1 flex flex-col bg-zinc-950">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Parsed Output</span>
          </div>
          <div className="flex-1 overflow-y-auto font-mono text-xs">
            {filteredLogs.length > 0 ? (
              filteredLogs.map(log => (
                <div key={log.id} className="flex border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors group">
                  <div className="w-24 px-3 py-2 text-zinc-600 border-r border-zinc-900 flex-shrink-0">{log.timestamp}</div>
                  <div className={cn(
                    "w-16 px-3 py-2 font-bold uppercase text-[10px] border-r border-zinc-900 flex-shrink-0",
                    log.level === 'error' ? "text-red-500" : 
                    log.level === 'warn' ? "text-amber-500" : 
                    log.level === 'debug' ? "text-sky-500" : "text-emerald-500"
                  )}>
                    {log.level}
                  </div>
                  <div className="flex-1 px-3 py-2 text-zinc-300 break-all whitespace-pre-wrap">{log.message}</div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-800">
                <Terminal size={48} className="mb-4 opacity-10" />
                <p className="text-sm italic">No logs to display</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

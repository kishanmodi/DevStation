import React, { useState } from 'react';
import { Type, RefreshCw, Copy, Check, CaseUpper, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

export const TextUtils: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toCamelCase = (str: string) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
  const toPascalCase = (str: string) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
  const toSnakeCase = (str: string) => str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || '';
  const toKebabCase = (str: string) => str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || '';

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
            <FileText size={16} className="text-zinc-500" />
            Text Input
          </h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to transform..."
            className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 outline-none focus:border-indigo-500 transition-colors"
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'UPPERCASE', val: text.toUpperCase(), id: 'upper' },
            { label: 'lowercase', val: text.toLowerCase(), id: 'lower' },
            { label: 'camelCase', val: toCamelCase(text), id: 'camel' },
            { label: 'PascalCase', val: toPascalCase(text), id: 'pascal' },
            { label: 'snake_case', val: toSnakeCase(text), id: 'snake' },
            { label: 'kebab-case', val: toKebabCase(text), id: 'kebab' },
          ].map(item => (
            <div key={item.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-between group">
              <div className="flex-1 min-w-0 mr-4">
                <div className="text-[10px] font-bold text-zinc-600 uppercase mb-1">{item.label}</div>
                <div className="text-sm font-mono text-zinc-300 truncate">{item.val || '...'}</div>
              </div>
              <button 
                onClick={() => handleCopy(item.val, item.id)}
                disabled={!text}
                className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0"
              >
                {copied === item.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </section>

        <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">
          <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
            <RefreshCw size={16} className="text-zinc-500" />
            Lorem Ipsum Generator
          </h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-md transition-all"
            >
              Generate Paragraph
            </button>
            <button 
              onClick={() => setText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-md transition-all"
            >
              Generate Sentence
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

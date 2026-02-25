import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  RefreshCw,
  Type
} from 'lucide-react';
import { cn } from '../../lib/utils';

const LOREM_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
  "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi."
];

export const LoremIpsum: React.FC = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let text = '';
    if (type === 'paragraphs') {
      text = Array(count).fill(0).map((_, i) => LOREM_PARAGRAPHS[i % LOREM_PARAGRAPHS.length]).join('\n\n');
    } else if (type === 'sentences') {
      const allSentences = LOREM_PARAGRAPHS.join(' ').split('. ');
      text = allSentences.slice(0, count).join('. ') + '.';
    } else {
      const allWords = LOREM_PARAGRAPHS.join(' ').split(' ');
      text = allWords.slice(0, count).join(' ');
    }
    setResult(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-16 bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-2 h-9 rounded-md outline-none focus:border-indigo-500"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-3 h-9 rounded-md outline-none focus:border-indigo-500"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <button
            onClick={generate}
            className="flex items-center gap-2 px-4 h-9 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-all shadow-lg shadow-indigo-500/20"
          >
            <RefreshCw size={14} />
            Generate
          </button>
        </div>

        <button
          onClick={handleCopy}
          disabled={!result}
          className={cn(
            "flex items-center gap-2 px-4 h-9 rounded-md text-xs font-bold transition-all",
            copied ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
          )}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy Text'}
        </button>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {result ? (
          <div className="max-w-3xl mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
            <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap font-serif text-lg">
              {result}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-800">
            <Type size={64} className="mb-4 opacity-10" />
            <p className="text-sm italic">Click generate to create some placeholder text</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  FileJson, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ArrowRightLeft, 
  Code, 
  Table, 
  FileCode,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const JsonToolkit: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'format' | 'minify' | 'ts' | 'zod' | 'yaml'>('format');

  const processJson = (tool: typeof activeTool) => {
    setError(null);
    if (!input) return;

    try {
      const parsed = JSON.parse(input);
      
      switch (tool) {
        case 'format':
          setOutput(JSON.stringify(parsed, null, 2));
          break;
        case 'minify':
          setOutput(JSON.stringify(parsed));
          break;
        case 'ts':
          setOutput(generateTypeScript(parsed));
          break;
        case 'zod':
          setOutput(generateZod(parsed));
          break;
        case 'yaml':
          setOutput("# YAML conversion coming soon\n" + JSON.stringify(parsed, null, 2));
          break;
      }
      setActiveTool(tool);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const generateTypeScript = (obj: any, name: string = 'Root'): string => {
    const getType = (val: any): string => {
      if (val === null) return 'null';
      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]';
        return `${getType(val[0])}[]`;
      }
      if (typeof val === 'object') return 'object';
      return typeof val;
    };

    let result = `interface ${name} {\n`;
    for (const key in obj) {
      const type = getType(obj[key]);
      result += `  ${key}: ${type};\n`;
    }
    result += `}`;
    return result;
  };

  const generateZod = (obj: any): string => {
    let result = `import { z } from 'zod';\n\nconst schema = z.object({\n`;
    for (const key in obj) {
      const val = obj[key];
      let type = 'z.any()';
      if (typeof val === 'string') type = 'z.string()';
      else if (typeof val === 'number') type = 'z.number()';
      else if (typeof val === 'boolean') type = 'z.boolean()';
      else if (Array.isArray(val)) type = 'z.array(z.any())';
      else if (typeof val === 'object' && val !== null) type = 'z.object({})';
      
      result += `  ${key}: ${type},\n`;
    }
    result += `});`;
    return result;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => processJson('format')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              activeTool === 'format' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <FileJson size={14} />
            Format
          </button>
          <button
            onClick={() => processJson('minify')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              activeTool === 'minify' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Zap size={14} />
            Minify
          </button>
          <button
            onClick={() => processJson('ts')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              activeTool === 'ts' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Code size={14} />
            To TS
          </button>
          <button
            onClick={() => processJson('zod')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              activeTool === 'zod' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <CheckCircle2 size={14} />
            To Zod
          </button>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-1.5 text-red-400 text-xs mr-4">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            disabled={!output}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium transition-all disabled:opacity-50"
          >
            <Copy size={14} />
            Copy Output
          </button>
        </div>
      </div>

      <div className="flex-1 flex divide-x divide-zinc-800 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-1.5 bg-zinc-900/30 text-[10px] text-zinc-500 uppercase tracking-widest font-bold border-b border-zinc-800">
            Input JSON
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language="json"
              theme="vs-dark"
              value={input}
              onChange={(val) => setInput(val || '')}
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
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-1.5 bg-zinc-900/30 text-[10px] text-zinc-500 uppercase tracking-widest font-bold border-b border-zinc-800">
            Output ({activeTool})
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={activeTool === 'ts' || activeTool === 'zod' ? 'typescript' : 'json'}
              theme="vs-dark"
              value={output}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono',
                readOnly: true,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

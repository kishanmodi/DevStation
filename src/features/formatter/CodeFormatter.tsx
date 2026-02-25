import React, { useState, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as prettier from 'prettier/standalone';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import * as prettierPluginHtml from 'prettier/plugins/html';
import * as prettierPluginPostcss from 'prettier/plugins/postcss';
import * as prettierPluginMarkdown from 'prettier/plugins/markdown';
import { Copy, Check, Wand2, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

import * as prettierPluginYaml from 'prettier/plugins/yaml';
import * as prettierPluginGraphql from 'prettier/plugins/graphql';

type Language = 'javascript' | 'typescript' | 'json' | 'html' | 'css' | 'markdown' | 'sql' | 'yaml' | 'graphql' | 'python' | 'java' | 'shell';

const LANGUAGES: { id: Language; label: string; parser: string; plugins: any[] }[] = [
  { id: 'javascript', label: 'JavaScript', parser: 'babel', plugins: [prettierPluginBabel, prettierPluginEstree] },
  { id: 'typescript', label: 'TypeScript', parser: 'babel-ts', plugins: [prettierPluginBabel, prettierPluginEstree] },
  { id: 'json', label: 'JSON', parser: 'json', plugins: [prettierPluginBabel, prettierPluginEstree] },
  { id: 'html', label: 'HTML', parser: 'html', plugins: [prettierPluginHtml] },
  { id: 'css', label: 'CSS', parser: 'css', plugins: [prettierPluginPostcss] },
  { id: 'markdown', label: 'Markdown', parser: 'markdown', plugins: [prettierPluginMarkdown] },
  { id: 'yaml', label: 'YAML', parser: 'yaml', plugins: [prettierPluginYaml] },
  { id: 'graphql', label: 'GraphQL', parser: 'graphql', plugins: [prettierPluginGraphql] },
  { id: 'python', label: 'Python', parser: 'python', plugins: [] },
  { id: 'java', label: 'Java', parser: 'java', plugins: [] },
  { id: 'shell', label: 'Shell', parser: 'sh', plugins: [] },
];

export const CodeFormatter: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [copied, setCopied] = useState(false);
  const [formatting, setFormatting] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleFormat = async () => {
    if (!code) return;
    setFormatting(true);
    try {
      const langConfig = LANGUAGES.find(l => l.id === language);
      if (!langConfig) return;

      if (langConfig.plugins.length === 0) {
        // For languages without prettier plugins in browser, use monaco's built-in formatter if available
        // or just show a message. Actually, we can try to trigger monaco format
        if (editorRef.current) {
          editorRef.current.getAction('editor.action.formatDocument').run();
        }
        return;
      }

      const formatted = await prettier.format(code, {
        parser: langConfig.parser,
        plugins: langConfig.plugins,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
      });
      setCode(formatted);
    } catch (err) {
      console.error('Formatting error:', err);
    } finally {
      setFormatting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
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
            onClick={handleFormat}
            disabled={formatting || !code}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            <Wand2 size={14} className={formatting ? "animate-spin" : ""} />
            {formatting ? 'Formatting...' : 'Format Code'}
          </button>
          
          <button
            onClick={handleCopy}
            disabled={!code}
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

      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            theme: 'vs-dark',
          }}
        />
      </div>
    </div>
  );
};

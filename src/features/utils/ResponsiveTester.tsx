import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, Globe, RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

const DEVICES = [
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: 375, height: 667 },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: 768, height: 1024 },
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: 1280, height: 800 },
];

export const ResponsiveTester: React.FC = () => {
  const [url, setUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [device, setDevice] = useState(DEVICES[2]);
  const [key, setKey] = useState(0);

  const handleTest = (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = url;
    if (targetUrl && !targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }
    setActiveUrl(targetUrl);
  };

  const refresh = () => setKey(k => k + 1);

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
        <form onSubmit={handleTest} className="flex items-center gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to test (e.g. google.com)"
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm pl-10 pr-4 h-10 rounded-md outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 h-10 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-md transition-all shadow-lg shadow-indigo-500/20"
          >
            Test
          </button>
        </form>
      </div>

      <div className="flex-1 flex flex-col bg-zinc-900/10 overflow-hidden">
        <div className="flex items-center justify-center gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50">
          {DEVICES.map(d => (
            <button
              key={d.id}
              onClick={() => setDevice(d)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                device.id === d.id ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <d.icon size={14} />
              {d.label}
            </button>
          ))}
          <div className="h-4 w-px bg-zinc-800 mx-2" />
          <button onClick={refresh} className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300">
            <RefreshCw size={14} />
          </button>
          <a 
            href={activeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
          >
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="flex-1 overflow-auto p-8 flex justify-center bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:20px_20px]">
          {activeUrl ? (
            <div 
              className="bg-white rounded-lg shadow-2xl overflow-hidden border-[12px] border-zinc-800 transition-all duration-500 ease-in-out"
              style={{ width: device.width, height: device.height }}
            >
              <iframe
                key={key}
                src={activeUrl}
                className="w-full h-full border-none"
                title="Responsive Test"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-700 max-w-xs text-center">
              <Monitor size={64} className="mb-6 opacity-10" />
              <h3 className="text-lg font-bold text-zinc-500 mb-2">Responsive Tester</h3>
              <p className="text-sm italic">Enter a URL above to test its responsiveness. Note: Some sites (like Google, GitHub) block being loaded in iframes for security.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

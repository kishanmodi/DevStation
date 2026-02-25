import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Clock, Calendar, Globe, ArrowRightLeft, Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const TimeTools: React.FC = () => {
  const [now, setNow] = useState(dayjs());
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateStr, setDateStr] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const convertTimestamp = () => {
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return 'Invalid Timestamp';
    return dayjs.unix(ts).format('YYYY-MM-DD HH:mm:ss');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Current Time Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-2">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Local Time</div>
            <div className="text-xl font-mono text-zinc-100">{now.format('HH:mm:ss')}</div>
            <div className="text-xs text-zinc-500">{now.format('dddd, MMMM D, YYYY')}</div>
          </div>
          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-2">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">UTC Time</div>
            <div className="text-xl font-mono text-zinc-100">{now.utc().format('HH:mm:ss')}</div>
            <div className="text-xs text-zinc-500">Universal Time Coordinated</div>
          </div>
          <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-2">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Unix Timestamp</div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-mono text-indigo-400">{Math.floor(now.valueOf() / 1000)}</div>
              <button onClick={() => handleCopy(Math.floor(now.valueOf() / 1000).toString(), 'now-ts')} className="text-zinc-500 hover:text-zinc-300">
                {copied === 'now-ts' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="text-xs text-zinc-500">Seconds since epoch</div>
          </div>
        </div>

        {/* Converter */}
        <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-6">
          <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-zinc-500" />
            Timestamp Converter
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-zinc-500">Unix Timestamp (seconds)</label>
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm font-mono text-zinc-300 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-zinc-500">Human Readable (Local)</label>
              <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm font-mono text-zinc-400">
                {convertTimestamp()}
              </div>
            </div>
          </div>
        </section>

        {/* Timezones */}
        <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">
          <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
            <Globe size={16} className="text-zinc-500" />
            World Clock
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'New York', tz: 'America/New_York' },
              { label: 'London', tz: 'Europe/London' },
              { label: 'Tokyo', tz: 'Asia/Tokyo' },
              { label: 'Sydney', tz: 'Australia/Sydney' },
            ].map(city => (
              <div key={city.label} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] font-bold text-zinc-600 uppercase mb-1">{city.label}</div>
                <div className="text-sm font-mono text-zinc-300">{now.tz(city.tz).format('HH:mm')}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

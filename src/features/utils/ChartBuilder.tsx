import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Plus, 
  Trash2, 
  BarChart3, 
  LineChart as LineIcon, 
  AreaChart as AreaIcon, 
  PieChart as PieIcon,
  Download,
  Settings2
} from 'lucide-react';
import { cn } from '../../lib/utils';

type ChartType = 'bar' | 'line' | 'area' | 'pie';

interface DataPoint {
  name: string;
  value: number;
}

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

export const ChartBuilder: React.FC = () => {
  const [type, setType] = useState<ChartType>('bar');
  const [data, setData] = useState<DataPoint[]>([
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
  ]);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  const addDataPoint = () => {
    if (newName && newValue) {
      setData([...data, { name: newName, value: Number(newValue) }]);
      setNewName('');
      setNewValue('');
    }
  };

  const removeDataPoint = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        );
    }
  };

  return (
    <div className="flex h-full bg-zinc-950 overflow-hidden">
      {/* Sidebar: Data Entry */}
      <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-900/20">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
          <Settings2 size={16} className="text-zinc-500" />
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Chart Config</span>
        </div>
        
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          <section className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Chart Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'bar', icon: BarChart3, label: 'Bar' },
                { id: 'line', icon: LineIcon, label: 'Line' },
                { id: 'area', icon: AreaIcon, label: 'Area' },
                { id: 'pie', icon: PieIcon, label: 'Pie' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id as ChartType)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                    type === t.id 
                      ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                  )}
                >
                  <t.icon size={20} />
                  <span className="text-[10px] font-bold uppercase">{t.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Data Points</label>
            <div className="space-y-2">
              {data.map((point, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <div className="flex-1 flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                    <span className="text-xs text-zinc-300 flex-1 truncate">{point.name}</span>
                    <span className="text-xs font-mono text-indigo-400">{point.value}</span>
                  </div>
                  <button 
                    onClick={() => removeDataPoint(i)}
                    className="p-2 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="pt-4 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs px-3 h-9 rounded-lg outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-20 bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs px-3 h-9 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={addDataPoint}
                className="w-full flex items-center justify-center gap-2 h-9 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-all border border-zinc-700"
              >
                <Plus size={14} />
                Add Point
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Main Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Live Visualization</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20">
            <Download size={14} />
            Export Image
          </button>
        </div>

        <div className="flex-1 p-12 flex items-center justify-center bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="w-full h-full max-w-4xl max-h-[500px] bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart() as any}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

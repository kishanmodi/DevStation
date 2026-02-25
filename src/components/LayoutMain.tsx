import React, { useEffect } from 'react';
import { useAppStore, ToolId } from '../store/useAppStore';
import { 
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
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Moon,
  Sun,
  Terminal,
  Split,
  Trash2,
  Clock,
  Cloud,
  Share2,
  FileDown,
  Type,
  MonitorOff,
  Palette,
  BarChart,
  Network
} from 'lucide-react';
import { cn } from '../lib/utils';

// Feature Components (Lazy loaded)
const HashNotes = React.lazy(() => import('../features/notes/HashNotes').then(m => ({ default: m.HashNotes })));
const CodeFormatter = React.lazy(() => import('../features/formatter/CodeFormatter').then(m => ({ default: m.CodeFormatter })));
const JsonToolkit = React.lazy(() => import('../features/json/JsonToolkit').then(m => ({ default: m.JsonToolkit })));
const HttpRequestBuilder = React.lazy(() => import('../features/http/HttpRequestBuilder').then(m => ({ default: m.HttpRequestBuilder })));
const TimeTools = React.lazy(() => import('../features/utils/TimeTools').then(m => ({ default: m.TimeTools })));
const GitHelpers = React.lazy(() => import('../features/git/GitHelpers').then(m => ({ default: m.GitHelpers })));
const ResponsiveTester = React.lazy(() => import('../features/utils/ResponsiveTester').then(m => ({ default: m.ResponsiveTester })));
const EnvEditor = React.lazy(() => import('../features/env/EnvEditor').then(m => ({ default: m.EnvEditor })));
const LogViewer = React.lazy(() => import('../features/logs/LogViewer').then(m => ({ default: m.LogViewer })));
const DiffViewer = React.lazy(() => import('../features/utils/DiffViewer').then(m => ({ default: m.DiffViewer })));
const RegexTester = React.lazy(() => import('../features/utils/RegexTester').then(m => ({ default: m.RegexTester })));
const LoremIpsum = React.lazy(() => import('../features/utils/LoremIpsum').then(m => ({ default: m.LoremIpsum })));
const K8sTool = React.lazy(() => import('../features/k8s/K8sTool').then(m => ({ default: m.K8sTool })));
const DiagramCreator = React.lazy(() => import('../features/diagrams/DiagramCreator').then(m => ({ default: m.DiagramCreator })));
import { MdToPdf as MdToPdfComponent } from '../features/utils/MdToPdf';
const MdToPdf = MdToPdfComponent; // not lazily loaded to avoid fetch failures
const Whiteboard = React.lazy(() => import('../features/utils/Whiteboard').then(m => ({ default: m.Whiteboard })));
const ChartBuilder = React.lazy(() => import('../features/utils/ChartBuilder').then(m => ({ default: m.ChartBuilder })));
const FlowBuilder = React.lazy(() => import('../features/diagrams/FlowBuilder').then(m => ({ default: m.FlowBuilder })));
const JwtLab = React.lazy(() => import('../features/security/JwtLab').then(m => ({ default: m.JwtLab })));

const TOOL_ICONS: Record<ToolId, React.ReactNode> = {
  notes: <StickyNote size={18} />,
  formatter: <Code2 size={18} />,
  json: <Braces size={18} />,
  http: <Globe size={18} />,
  security: <ShieldCheck size={18} />,
  git: <GitBranch size={18} />,
  env: <Variable size={18} />,
  logs: <FileText size={18} />,
  utils: <Search size={18} />,
  frontend: <Layout size={18} />,
  system: <Split size={18} />,
  time: <Clock size={18} />,
  k8s: <Cloud size={18} />,
  diagram: <Share2 size={18} />,
  md2pdf: <FileDown size={18} />,
  lorem: <Type size={18} />,
  whiteboard: <Palette size={18} />,
  charts: <BarChart size={18} />,
  flow: <Network size={18} />,
};

const TOOL_NAMES: Record<ToolId, string> = {
  notes: 'Hash Notes',
  formatter: 'Formatter',
  json: 'JSON Toolkit',
  http: 'HTTP Client',
  security: 'JWT Lab',
  git: 'Git Helpers',
  env: 'Env Editor',
  logs: 'Log Viewer',
  utils: 'Regex Tester',
  frontend: 'Responsive',
  system: 'Diff Viewer',
  time: 'Time Tools',
  k8s: 'Kubernetes',
  diagram: 'Diagrams',
  md2pdf: 'MD to PDF',
  lorem: 'Lorem Ipsum',
  whiteboard: 'Whiteboard',
  charts: 'Chart Builder',
  flow: 'Flow Builder',
};

export const LayoutMain: React.FC = () => {
  const { 
    tabs, 
    activeTabId, 
    sidebarOpen, 
    addTab, 
    removeTab, 
    closeAllTabs,
    setActiveTab, 
    toggleSidebar 
  } = useAppStore();

  // For small screens we rely on CSS rather than JavaScript –
  // the `md:hidden`/`md:flex` utilities will show a simple warning
  // while still allowing the app to render in the DOM (hidden) so
  // hydration stays smooth and there’s no jitter when the bundle loads.

  // NOTE: old mobile-detection state was removed; we no longer
  // conditionally return early.

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Handle URL hash for notes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/note/')) {
        const content = hash.replace('#/note/', '');
        // If no notes tab is active or we want to open this specific one
        addTab('notes', 'Hash Note', { initialContent: content });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const renderTool = (tab: typeof tabs[0]) => {
    switch (tab.toolId) {
      case 'notes': return <HashNotes key={tab.id} tabId={tab.id} initialData={tab.data} />;
      case 'formatter': return <CodeFormatter key={tab.id} />;
      case 'json': return <JsonToolkit key={tab.id} />;
      case 'http': return <HttpRequestBuilder key={tab.id} />;
      case 'security': return <JwtLab key={tab.id} />;
      case 'git': return <GitHelpers key={tab.id} />;
      case 'logs': return <LogViewer key={tab.id} />;
      case 'frontend': return <ResponsiveTester key={tab.id} />;
      case 'env': return <EnvEditor key={tab.id} />;
      case 'system': return <DiffViewer key={tab.id} />;
      case 'utils': return <RegexTester key={tab.id} />;
      case 'time': return <TimeTools key={tab.id} />;
      case 'k8s': return <K8sTool key={tab.id} />;
      case 'diagram': return <DiagramCreator key={tab.id} />;
      case 'md2pdf': return <MdToPdf key={tab.id} />;
      case 'lorem': return <LoremIpsum key={tab.id} />;
      case 'whiteboard': return <Whiteboard key={tab.id} />;
      case 'charts': return <ChartBuilder key={tab.id} />;
      case 'flow': return <FlowBuilder key={tab.id} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
          <Wrench size={48} className="mb-4 opacity-20" />
          <p>Tool "{TOOL_NAMES[tab.toolId]}" is coming soon...</p>
        </div>
      );
    }
  };

  return (
    <>
      {/* static warning for phone-sized viewports */}
      <div className="md:hidden flex items-center justify-center h-screen bg-zinc-900 text-zinc-50 p-4 text-center">
        <p className="text-lg">
          This application is designed for desktop screens.
          Please open it on a larger device or resize your browser.
        </p>
      </div>

      {/* actual desktop UI; hidden on small screens */}
      <div className="hidden md:flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50 font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        style={{ width: sidebarOpen ? 240 : 64 }}
        className="flex flex-col border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl transition-all duration-300"
      >
        <div className="flex items-center h-14 px-4 border-b border-zinc-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <Terminal size={18} className="text-white" />
            </div>
            {sidebarOpen && <span className="font-bold tracking-tight whitespace-nowrap">DevStation</span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {(Object.keys(TOOL_NAMES) as ToolId[]).map((toolId) => (
            <button
              key={toolId}
              onClick={() => addTab(toolId, TOOL_NAMES[toolId])}
              className={cn(
                "flex items-center w-full gap-3 px-3 py-2 rounded-md transition-all group",
                "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100",
                !sidebarOpen && "justify-center px-0"
              )}
              title={TOOL_NAMES[toolId]}
            >
              <span className="flex-shrink-0 group-hover:scale-110 transition-transform">
                {TOOL_ICONS[toolId]}
              </span>
              {sidebarOpen && <span className="text-sm font-medium">{TOOL_NAMES[toolId]}</span>}
            </button>
          ))}
        </div>

        <div className="p-2 border-t border-zinc-800 space-y-1">
          <button 
            onClick={toggleSidebar}
            className="flex items-center w-full gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-all"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            {sidebarOpen && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex items-center h-12 bg-zinc-950 border-b border-zinc-800/50 px-2 gap-2">
          <div className="flex-1 flex items-end h-full overflow-x-auto scrollbar-hide gap-1">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 h-[38px] rounded-t-xl cursor-pointer text-[11px] font-bold uppercase tracking-wider transition-all min-w-[140px] max-w-[220px] relative group border-x border-t",
                  tab.active 
                    ? "bg-zinc-900 border-zinc-800 text-indigo-400 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]" 
                    : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                )}
              >
                <span className={cn(
                  "flex-shrink-0 transition-transform duration-300",
                  tab.active ? "scale-110 text-indigo-500" : "opacity-40 group-hover:opacity-70"
                )}>
                  {TOOL_ICONS[tab.toolId]}
                </span>
                <span className="truncate flex-1">{tab.title}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeTab(tab.id); }}
                  className={cn(
                    "p-1 rounded-md transition-all hover:bg-zinc-800 hover:text-red-400",
                    tab.active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <X size={12} />
                </button>
                {tab.active && (
                  <div 
                    className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-indigo-500 z-10"
                  />
                )}
              </div>
            ))}
          </div>
          {tabs.length > 0 && (
            <div className="flex items-center h-full pb-1">
              <button 
                onClick={closeAllTabs}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Workspace */}
        <div className="flex-1 relative overflow-hidden">
            {activeTab ? (
              <div
                key={activeTab.id}
                className="h-full w-full"
              >
                <React.Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                }>
                  {renderTool(activeTab)}
                </React.Suspense>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
                  <Terminal size={40} className="text-zinc-700" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-zinc-300 mb-2">Welcome to DevStation</h2>
                  <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                    Select a tool from the sidebar to get started. 
                    Everything stays local on your machine.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-left">
                    <div className="text-xs font-bold text-indigo-400 mb-1 uppercase tracking-wider">Privacy</div>
                    <div className="text-xs text-zinc-400">No data ever leaves your browser. No servers, no tracking.</div>
                  </div>
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-left">
                    <div className="text-xs font-bold text-emerald-400 mb-1 uppercase tracking-wider">Speed</div>
                    <div className="text-xs text-zinc-400">Instant tools powered by your local hardware.</div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
    </>
  );
};

import React, { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Panel,
  Handle,
  Position,
  NodeProps,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { 
  Plus, 
  Download, 
  Trash2, 
  MousePointer2, 
  Square, 
  Circle, 
  Database,
  Layout,
  User,
  Globe,
  Cloud as CloudIcon,
  Cpu,
  FileJson,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Custom Node Component with Editable Text and Shapes
const CustomNode = ({ data, selected }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState((data?.label as string) || '');

  const onBlur = () => {
    setIsEditing(false);
    if (data) data.label = label;
  };

  if (!data) return null;

  const renderShape = () => {
    const type = (data.shapeType as string) || 'default';
    const baseClasses = cn(
      "flex items-center justify-center p-4 min-w-[120px] min-h-[60px] transition-all duration-200",
      selected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950" : "border border-zinc-700"
    );

    switch (type) {
      case 'Cloud':
        return (
          <div className={cn(baseClasses, "bg-indigo-900/40 rounded-[40px] relative")}>
            <CloudIcon className="absolute -top-3 -left-3 text-indigo-400 opacity-50" size={24} />
            {isEditing ? (
              <input 
                autoFocus
                className="bg-transparent text-white text-center outline-none w-full"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={onBlur}
              />
            ) : (
              <span onDoubleClick={() => setIsEditing(true)} className="text-white text-xs font-medium cursor-text">{label}</span>
            )}
          </div>
        );
      case 'Database':
        return (
          <div className={cn(baseClasses, "bg-zinc-900/80 rounded-lg border-t-4 border-t-indigo-500")}>
            <Database className="absolute -top-3 -left-3 text-indigo-400 opacity-50" size={20} />
            {isEditing ? (
              <input 
                autoFocus
                className="bg-transparent text-white text-center outline-none w-full"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={onBlur}
              />
            ) : (
              <span onDoubleClick={() => setIsEditing(true)} className="text-white text-xs font-medium cursor-text">{label}</span>
            )}
          </div>
        );
      case 'Decision':
        return (
          <div className={cn(baseClasses, "bg-amber-900/40 rotate-45 border-2 border-amber-500/50")}>
            <div className="-rotate-45 flex items-center justify-center w-full h-full">
              {isEditing ? (
                <input 
                  autoFocus
                  className="bg-transparent text-white text-center outline-none w-full"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onBlur={onBlur}
                />
              ) : (
                <span onDoubleClick={() => setIsEditing(true)} className="text-white text-xs font-medium cursor-text">{label}</span>
              )}
            </div>
          </div>
        );
      case 'User':
        return (
          <div className={cn(baseClasses, "bg-emerald-900/40 rounded-full border-2 border-emerald-500/50 aspect-square min-w-[80px] min-h-[80px]")}>
            <User className="absolute -top-2 -left-2 text-emerald-400 opacity-50" size={20} />
            {isEditing ? (
              <input 
                autoFocus
                className="bg-transparent text-white text-center outline-none w-full"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={onBlur}
              />
            ) : (
              <span onDoubleClick={() => setIsEditing(true)} className="text-white text-xs font-medium cursor-text">{label}</span>
            )}
          </div>
        );
      default:
        return (
          <div className={cn(baseClasses, "bg-zinc-900 border-zinc-700 rounded-md")}>
            {isEditing ? (
              <input 
                autoFocus
                className="bg-transparent text-white text-center outline-none w-full"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={onBlur}
              />
            ) : (
              <span onDoubleClick={() => setIsEditing(true)} className="text-white text-xs font-medium cursor-text">{label}</span>
            )}
          </div>
        );
    }
  };

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-indigo-500 !w-2 !h-2" />
      {renderShape()}
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-2 !h-2" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'User Request', shapeType: 'User' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

const NODE_TYPES = [
  { id: 'Process', icon: Square, label: 'Process' },
  { id: 'Decision', icon: Layout, label: 'Decision', rotate: true },
  { id: 'Database', icon: Database, label: 'Database' },
  { id: 'User', icon: User, label: 'User' },
  { id: 'API', icon: Globe, label: 'API' },
  { id: 'Cloud', icon: CloudIcon, label: 'Cloud' },
  { id: 'System', icon: Cpu, label: 'System' },
];

export const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = (type: string) => {
    const id = (nodes.length + 1).toString();
    const newNode: Node = {
      id,
      type: 'custom',
      data: { label: `${type} ${id}`, shapeType: type },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const clearFlow = () => {
    setNodes([]);
    setEdges([]);
  };

  const exportToJson = () => {
    const flow = { nodes, edges };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flow, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "flow-diagram.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportToPng = () => {
    if (reactFlowWrapper.current === null) return;

    toPng(reactFlowWrapper.current, {
      backgroundColor: '#09090b',
      filter: (node) => {
        // Filter out controls and other UI elements if needed
        if (
          node?.classList?.contains('react-flow__controls') ||
          node?.classList?.contains('react-flow__panel')
        ) {
          return false;
        }
        return true;
      },
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'flow-diagram.png';
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 mr-4 overflow-x-auto max-w-[50vw] scrollbar-hide">
            {NODE_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => addNode(t.id)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-all whitespace-nowrap"
              >
                <t.icon size={14} className={cn(t.rotate && "rotate-45")} />
                {t.label}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hidden lg:block">Double-click text to edit</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToPng}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20"
          >
            <ImageIcon size={14} />
            Export PNG
          </button>
          <button
            onClick={exportToJson}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-all border border-zinc-700"
          >
            <FileJson size={14} />
            Export JSON
          </button>
          <button
            onClick={clearFlow}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-all border border-red-500/20"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      <div ref={reactFlowWrapper} className="flex-1 relative bg-zinc-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          colorMode="dark"
          fitView
        >
          <Controls className="bg-zinc-900 border-zinc-800 fill-zinc-100" />
          <MiniMap 
            style={{ background: '#09090b', border: '1px solid #27272a' }} 
            nodeColor="#27272a"
            maskColor="rgba(0, 0, 0, 0.5)"
          />
          <Background color="#27272a" gap={20} />
          
          <Panel position="top-right" className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-3 rounded-xl text-zinc-400 text-[10px] max-w-[200px]">
            <p className="font-bold text-zinc-200 mb-1 uppercase tracking-wider">Instructions</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Double-click text to edit node label.</li>
              <li>Drag from handles to connect.</li>
              <li>Select and press Backspace to delete.</li>
            </ul>
          </Panel>
        </ReactFlow>
      </div>

      <style>{`
        .react-flow__node {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }
        .react-flow__handle {
          width: 8px;
          height: 8px;
          background: #6366f1 !important;
          border: 2px solid #1e1b4b !important;
        }
        .react-flow__edge-path {
          stroke: #4b5563;
          stroke-width: 2;
        }
        .react-flow__controls-button {
          background: #18181b !important;
          border-bottom: 1px solid #27272a !important;
          fill: #71717a !important;
        }
        .react-flow__controls-button:hover {
          background: #27272a !important;
        }
      `}</style>
    </div>
  );
};

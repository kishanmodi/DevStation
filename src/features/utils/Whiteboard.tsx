import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Arrow } from 'react-konva';
import { 
  Pencil, 
  Square, 
  Circle as CircleIcon, 
  ArrowRight, 
  Eraser, 
  Trash2, 
  Download,
  MousePointer2
} from 'lucide-react';
import { cn } from '../../lib/utils';

type Tool = 'pencil' | 'rect' | 'circle' | 'arrow' | 'eraser' | 'select';

interface Shape {
  id: string;
  type: Tool;
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  strokeWidth: number;
}

export const Whiteboard: React.FC = () => {
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#6366f1');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        setDimensions({
          width: containerRef.current?.offsetWidth || 800,
          height: containerRef.current?.offsetHeight || 600,
        });
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  const handleMouseDown = (e: any) => {
    if (tool === 'select') return;
    
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    const id = Math.random().toString(36).substr(2, 9);
    
    if (tool === 'pencil' || tool === 'eraser') {
      setShapes([...shapes, { 
        id, 
        type: tool, 
        points: [pos.x, pos.y], 
        color: tool === 'eraser' ? '#09090b' : color, 
        strokeWidth: tool === 'eraser' ? 20 : 3 
      }]);
    } else if (tool === 'rect') {
      setShapes([...shapes, { id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, color, strokeWidth: 3 }]);
    } else if (tool === 'circle') {
      setShapes([...shapes, { id, type: 'circle', x: pos.x, y: pos.y, radius: 0, color, strokeWidth: 3 }]);
    } else if (tool === 'arrow') {
      setShapes([...shapes, { id, type: 'arrow', points: [pos.x, pos.y, pos.x, pos.y], color, strokeWidth: 3 }]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastShape = shapes[shapes.length - 1];

    if (tool === 'pencil' || tool === 'eraser') {
      lastShape.points = lastShape.points?.concat([point.x, point.y]);
    } else if (tool === 'rect') {
      lastShape.width = point.x - (lastShape.x || 0);
      lastShape.height = point.y - (lastShape.y || 0);
    } else if (tool === 'circle') {
      const dx = point.x - (lastShape.x || 0);
      const dy = point.y - (lastShape.y || 0);
      lastShape.radius = Math.sqrt(dx * dx + dy * dy);
    } else if (tool === 'arrow') {
      lastShape.points = [lastShape.points![0], lastShape.points![1], point.x, point.y];
    }

    setShapes(shapes.concat());
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setShapes([]);
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden">
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 mr-4">
            {[
              { id: 'select', icon: MousePointer2 },
              { id: 'pencil', icon: Pencil },
              { id: 'rect', icon: Square },
              { id: 'circle', icon: CircleIcon },
              { id: 'arrow', icon: ArrowRight },
              { id: 'eraser', icon: Eraser },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id as Tool)}
                className={cn(
                  "p-2 rounded-md transition-all",
                  tool === t.id ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <t.icon size={18} />
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#ffffff'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all",
                  color === c ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-all"
          >
            <Download size={14} />
            Export PNG
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-all border border-red-500/20"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 bg-zinc-950 cursor-crosshair relative overflow-hidden">
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            {shapes.map((shape) => {
              if (shape.type === 'pencil' || shape.type === 'eraser') {
                return (
                  <Line
                    key={shape.id}
                    points={shape.points}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              } else if (shape.type === 'rect') {
                return (
                  <Rect
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                  />
                );
              } else if (shape.type === 'circle') {
                return (
                  <Circle
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                  />
                );
              } else if (shape.type === 'arrow') {
                return (
                  <Arrow
                    key={shape.id}
                    points={shape.points}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    fill={shape.color}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

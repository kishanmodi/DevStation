import React, { useState } from 'react';
import Markdown from 'react-markdown';
import {
  FileText, 
  Download, 
  Eye, 
  Code,
  Layout
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const MdToPdf: React.FC = () => {
  const [md, setMd] = useState('# Project Documentation\n\n## Introduction\nThis is a sample markdown document.\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n### Code Example\n```javascript\nconsole.log("Hello World");\n```');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  const handleDownload = async () => {
    const element = document.getElementById('markdown-preview');
    if (!element) {
      alert('Switch to preview first before exporting.');
      return;
    }

    try {
      // clone and strip Tailwind classes (mostly to avoid color functions)
      const clone = element.cloneNode(true) as HTMLElement;
      const stripClasses = (el: HTMLElement) => {
        el.removeAttribute('class');
        Array.from(el.children).forEach(child => stripClasses(child as HTMLElement));
      };
      stripClasses(clone);

      // off‑screen container to prevent flicker; keep natural size so
      // html2canvas can measure correctly.
      const wrapper = document.createElement('div');
      // position the clone off-screen but keep it visible to html2canvas
      // (visibility:hidden prevents rendering, which was causing blank PDFs).
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      // avoid hiding via visibility; off-screen positioning is enough
      // wrapper.style.visibility = 'hidden';
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      let filename = prompt('Enter file name (without extension):', 'document');
      if (!filename) filename = 'document';
      if (!filename.toLowerCase().endsWith('.pdf')) filename += '.pdf';

      // html2canvas and jsPDF are statically imported at the top to avoid
      // network errors when dynamically loading in some preview environments.
      // ensure libraries are available via CDN
      const loadScript = (src: string) => new Promise<void>((res, rej) => {
        if (document.querySelector(`script[src="${src}"]`)) return res();
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => res();
        s.onerror = () => rej(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
      });

      await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');

      // html2canvas needs the element to be technically visible; using
      // opacity or visibility hides it from the renderer. we position it
      // off-screen above instead.
      const canvas = await (window as any).html2canvas(clone, { scale: 2, useCORS: true, backgroundColor: '#fff' });
      // use PNG which jsPDF recognizes without extra plugins
      const imgData = canvas.toDataURL('image/png');

      const { jsPDF: JsPDFCtor } = (window as any).jspdf;
      const pdf = new JsPDFCtor('portrait', 'in', 'letter');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);

      document.body.removeChild(wrapper);
    } catch (err) {
      console.error('PDF export failed', err);
      alert('Unable to create PDF – see console for details.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-hidden relative">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setView('edit')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                view === 'edit' ? "bg-zinc-800 text-zinc-100 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Code size={14} />
              Editor
            </button>
            <button
              onClick={() => setView('preview')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                view === 'preview' ? "bg-zinc-800 text-zinc-100 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Eye size={14} />
              Preview
            </button>
          </div>

          {view === 'preview' && (
            <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setPreviewTheme('light')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all",
                  previewTheme === 'light' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
                )}
              >
                Light
              </button>
              <button
                onClick={() => setPreviewTheme('dark')}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all",
                  previewTheme === 'dark' ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
                )}
              >
                Dark
              </button>
            </div>
          )}
        </div>

        {view === 'preview' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 h-10 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-md transition-all shadow-lg shadow-green-500/20"
            >
              <Download size={16} />
              Download PDF
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {view === 'edit' ? (
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="flex-1 bg-transparent p-8 outline-none resize-none font-mono text-sm text-zinc-400 placeholder:text-zinc-800 print:hidden"
            placeholder="Write your markdown here..."
          />
        ) : (
          <div className={cn(
            "flex-1 overflow-y-auto p-12 md:p-20 print:p-0 transition-colors duration-300",
            previewTheme === 'light' ? "bg-white" : "bg-zinc-900"
          )}>
            <div
              id="markdown-preview"
              className={cn(
                "max-w-3xl mx-auto prose prose-zinc",
                previewTheme === 'dark' && "prose-invert"
              )}
            >
              <Markdown>{md}</Markdown>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .markdown-body, .markdown-body * { visibility: visible; }
          .markdown-body { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            padding: 2cm;
            color: black !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

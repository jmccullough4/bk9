import { useEffect, useRef } from 'react';
import { useBlueK9Store } from '../state/store';

function LogPanel() {
  const logs = useBlueK9Store((s) => s.logs);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg shadow-lg">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="font-semibold text-slate-100">Live Log Output</div>
        <div className="text-xs text-slate-400">{logs.length} entries</div>
      </div>
      <div ref={containerRef} className="max-h-56 overflow-y-auto px-4 py-3 text-sm space-y-1">
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-3 text-slate-300">
            <span className="text-slate-500 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className={`${log.level === 'error' ? 'text-red-400' : 'text-emerald-300'}`}>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogPanel;

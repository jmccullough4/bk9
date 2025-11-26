import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';
import { Device } from '../state/store';

interface Props {
  devices: Device[];
  selectedDeviceId?: string;
}

function AnalyticsPanel({ devices, selectedDeviceId }: Props) {
  const selectedHistory = useMemo(() => {
    return devices
      .filter((d) => !selectedDeviceId || d.id === selectedDeviceId)
      .map((d) => ({ name: d.name || d.id, rssi: d.rssi, time: new Date(d.lastSeen).toLocaleTimeString() }));
  }, [devices, selectedDeviceId]);

  const manufacturerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    devices.forEach((d) => {
      counts[d.manufacturer || 'Unknown'] = (counts[d.manufacturer || 'Unknown'] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [devices]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg shadow-lg p-4 space-y-4">
      <div className="font-semibold text-slate-100">Analytics</div>
      <div className="grid grid-cols-1 gap-4">
        <div className="h-40">
          <div className="text-xs text-slate-400 mb-2">RSSI Over Time</div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={selectedHistory}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[-100, -30]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
              <Area type="monotone" dataKey="rssi" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-36">
          <div className="text-xs text-slate-400 mb-2">Detections by Manufacturer</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={manufacturerCounts}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
              <Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPanel;

import { Device } from '../state/store';

interface Props {
  devices: Device[];
  selectedDeviceId?: string;
  onSelect: (id?: string) => void;
}

function SurveyTable({ devices, selectedDeviceId, onSelect }: Props) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="font-semibold text-slate-100">Bluetooth Survey</div>
        <div className="text-xs text-slate-400">{devices.length} devices</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="px-3 py-2 text-left">BD Address</th>
              <th className="px-3 py-2 text-left">Device Name</th>
              <th className="px-3 py-2 text-left">Manufacturer</th>
              <th className="px-3 py-2 text-left">RSSI</th>
              <th className="px-3 py-2 text-left">Emitter Location</th>
              <th className="px-3 py-2 text-left">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr
                key={device.id}
                className={`border-t border-slate-800 cursor-pointer ${
                  selectedDeviceId === device.id ? 'bg-slate-800/60' : 'hover:bg-slate-900'
                } ${device.isTarget ? 'text-red-400 font-semibold' : 'text-slate-200'}`}
                onClick={() => onSelect(device.id)}
              >
                <td className="px-3 py-2">{device.id}</td>
                <td className="px-3 py-2">{device.name}</td>
                <td className="px-3 py-2">{device.manufacturer}</td>
                <td className="px-3 py-2">{device.rssi} dBm</td>
                <td className="px-3 py-2">{device.emitterLocationText || 'Unknown'}</td>
                <td className="px-3 py-2 text-xs">{new Date(device.lastSeen).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SurveyTable;

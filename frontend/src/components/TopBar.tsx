interface Props {
  followGps: boolean;
  toggleFollowGps: () => void;
  mapStyle: string;
  setMapStyle: (style: string) => void;
  onClear: () => void;
}

function TopBar({ followGps, toggleFollowGps, mapStyle, setMapStyle, onClear }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 shadow-lg">
      <div>
        <div className="text-lg font-bold text-slate-100">BlueK9 Recon Dashboard</div>
        <div className="text-xs text-slate-400">Bluetooth + WiFi | Map-focused operations</div>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <button
          onClick={toggleFollowGps}
          className={`px-3 py-2 border border-slate-700 rounded ${
            followGps ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200'
          }`}
        >
          {followGps ? 'GPS Follow: ON' : 'GPS Follow: OFF'}
        </button>
        <select
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-100 px-2 py-2 rounded"
        >
          <option value="mapbox://styles/mapbox/dark-v11">Dark</option>
          <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
          <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
        </select>
        <button onClick={onClear} className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white border border-red-700 rounded">
          Clear Results
        </button>
      </div>
    </div>
  );
}

export default TopBar;

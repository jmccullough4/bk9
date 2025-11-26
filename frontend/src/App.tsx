import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MapView from './components/MapView';
import SurveyTable from './components/SurveyTable';
import LogPanel from './components/LogPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import LoginForm from './components/LoginForm';
import TopBar from './components/TopBar';
import { useWebSocket } from './hooks/useWebSocket';
import { useBlueK9Store } from './state/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function App() {
  useWebSocket();
  const [token, setToken] = useState<string>('');
  const isLoggedIn = useBlueK9Store((s) => s.isLoggedIn);
  const setLoggedIn = useBlueK9Store((s) => s.setLoggedIn);
  const devices = useBlueK9Store((s) => s.devices);
  const selectedDeviceId = useBlueK9Store((s) => s.selectedDeviceId);
  const selectDevice = useBlueK9Store((s) => s.selectDevice);
  const followGps = useBlueK9Store((s) => s.followGps);
  const toggleFollowGps = useBlueK9Store((s) => s.toggleFollowGps);
  const mapStyle = useBlueK9Store((s) => s.mapStyle);
  const setMapStyle = useBlueK9Store((s) => s.setMapStyle);

  const headers = useMemo(() => ({
    Authorization: `Basic ${token}`,
  }), [token]);

  useEffect(() => {
    if (!isLoggedIn && token) {
      setLoggedIn(true);
    }
  }, [isLoggedIn, setLoggedIn, token]);

  const handleLogin = async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/login`, { username, password });
    setToken(response.data.token);
    setLoggedIn(true);
  };

  const handleClear = async () => {
    await axios.post(
      `${API_BASE_URL}/api/devices/clear`,
      {},
      {
        headers,
      },
    );
    selectDevice(undefined);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
        <LoginForm onSubmit={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <TopBar
        followGps={followGps}
        toggleFollowGps={toggleFollowGps}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        onClear={handleClear}
      />
      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 lg:col-span-8">
          <MapView mapStyle={mapStyle} followGps={followGps} onSelectDevice={selectDevice} />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <SurveyTable devices={devices} selectedDeviceId={selectedDeviceId} onSelect={selectDevice} />
          <AnalyticsPanel devices={devices} selectedDeviceId={selectedDeviceId} />
        </div>
        <div className="col-span-12">
          <LogPanel />
        </div>
      </div>
    </div>
  );
}

export default App;

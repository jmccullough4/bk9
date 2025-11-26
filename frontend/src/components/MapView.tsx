import { useEffect, useMemo, useState } from 'react';
import Map, { CircleLayer, Layer, MapLayerMouseEvent, Marker, Source, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useBlueK9Store } from '../state/store';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Props {
  mapStyle: string;
  followGps: boolean;
  onSelectDevice: (id?: string) => void;
}

const circleStyle: CircleLayer = {
  id: 'cep-layer',
  type: 'circle',
  paint: {
    'circle-radius': ['get', 'radius'],
    'circle-color': '#38bdf8',
    'circle-opacity': 0.15,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#38bdf8',
  },
};

function MapView({ mapStyle, followGps, onSelectDevice }: Props) {
  const devices = useBlueK9Store((s) => s.devices);
  const gps = useBlueK9Store((s) => s.gps);
  const [viewState, setViewState] = useState({ latitude: 37.7749, longitude: -122.4194, zoom: 13 });

  useEffect(() => {
    if (followGps && gps) {
      setViewState((prev) => ({ ...prev, latitude: gps.lat, longitude: gps.lon }));
    }
  }, [followGps, gps]);

  const geoJson = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: devices
        .filter((d) => d.location)
        .map((d) => ({
          type: 'Feature' as const,
          properties: { radius: d.location?.cepRadius || 25 },
          geometry: {
            type: 'Point' as const,
            coordinates: [d.location!.lon, d.location!.lat],
          },
        })),
    };
  }, [devices]);

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  const handleMarkerClick = (evt: MapLayerMouseEvent, id?: string) => {
    evt.originalEvent.stopPropagation();
    onSelectDevice(id);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between p-3 text-sm text-slate-300">
        <div className="font-semibold text-slate-100">Emitter Map</div>
        <div className="text-xs">Follow GPS: {followGps ? 'On' : 'Off'}</div>
      </div>
      <Map
        reuseMaps
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={mapStyle}
        style={{ height: 520 }}
        {...viewState}
        onMove={handleMove}
      >
        <Source id="cep" type="geojson" data={geoJson}>
          <Layer {...circleStyle} />
        </Source>
        {devices
          .filter((d) => d.location)
          .map((device) => (
            <Marker
              key={device.id}
              latitude={device.location!.lat}
              longitude={device.location!.lon}
              onClick={(evt) => handleMarkerClick(evt, device.id)}
              anchor="bottom"
            >
              <div
                className={`px-2 py-1 text-xs rounded shadow-lg cursor-pointer ${
                  device.isTarget ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-100'
                }`}
              >
                {device.name || device.id}
              </div>
            </Marker>
          ))}
        {gps && (
          <Marker latitude={gps.lat} longitude={gps.lon} anchor="bottom">
            <div className="bg-emerald-500 text-slate-900 text-xs px-2 py-1 rounded-full shadow-lg">You</div>
          </Marker>
        )}
      </Map>
    </div>
  );
}

export default MapView;

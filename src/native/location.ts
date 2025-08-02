import { PluginListenerHandle, registerPlugin } from '@capacitor/core';
import { storeFix } from '@/lib/locationStore';

export interface LocationFix {
  timestamp: number;
  lat: number;
  lng: number;
}

interface LocationPlugin {
  start(): Promise<void>;
  stop(): Promise<void>;
  addListener(
    eventName: 'location',
    listener: (fix: LocationFix) => void,
  ): Promise<PluginListenerHandle>;
}

const Location = registerPlugin<LocationPlugin>('Location');

export const startLocationLogging = async () => {
  await Location.start();
  await Location.addListener('location', storeFix);
};

export const stopLocationLogging = () => Location.stop();

export default Location;

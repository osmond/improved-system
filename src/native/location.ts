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
  try {
    await Location.start();
    return await Location.addListener('location', storeFix);
  } catch (err) {
    console.error('Failed to start location logging', err);
    throw err;
  }
};

export const stopLocationLogging = async (
  handle?: PluginListenerHandle,
) => {
  if (handle) {
    try {
      await handle.remove();
    } catch (err) {
      console.error('Failed to remove location listener', err);
    }
  }
  return Location.stop();
};

export default Location;

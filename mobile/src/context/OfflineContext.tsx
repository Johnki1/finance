declare const window: any;

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { offlineStore } from '../services/offlineStore';

type OfflineContextType = {
  offline: boolean;
  pendingCount: number;
  sync: () => Promise<void>;
};

const OfflineContext = createContext<OfflineContextType>({
  offline: false,
  pendingCount: 0,
  sync: async () => {},
});

export const OfflineProvider = ({ children }: { children: React.ReactNode }) => {
  const [offline, setOffline] = useState(() => {
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      return !navigator.onLine;
    }
    return false;
  });
  const [pendingCount, setPendingCount] = useState(0);

  const refreshCount = async () => {
    const queue = await offlineStore.getQueue();
    setPendingCount(queue.length);
  };

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    refreshCount();
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const sync = useCallback(async () => {
    const queue = await offlineStore.getQueue();
    for (const item of queue) {
      // placeholder for controlled replay; avoid infinite retry currently
      await offlineStore.dequeue(item.id);
    }
    await refreshCount();
  }, []);

  return (
    <OfflineContext.Provider value={{ offline, pendingCount, sync }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
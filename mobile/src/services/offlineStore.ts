import { secureStorage } from './secureStorage';

const CACHE_PREFIX = 'offline_cache_';
const QUEUE_KEY = 'offline_queue';
const DEFAULT_TTL_MS = 5 * 60 * 1000;

type CacheEntry<T> = { data: T; cachedAt: number; ttl: number };

type OfflineQueueItem = {
  id: string;
  method: string;
  url: string;
  payload?: any;
  createdAt: number;
};

const safeParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const offlineStore = {
  async getCache<T>(key: string): Promise<CacheEntry<T> | null> {
    const raw = await secureStorage.getItem(CACHE_PREFIX + key);
    return safeParse<CacheEntry<T> | null>(raw, null);
  },

  setCache<T>(key: string, data: T, ttl = DEFAULT_TTL_MS) {
    const entry: CacheEntry<T> = { data, cachedAt: Date.now(), ttl };
    secureStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  },

  clearCache(key: string) {
    secureStorage.removeItem(CACHE_PREFIX + key);
  },

  async getQueue(): Promise<OfflineQueueItem[]> {
    const raw = await secureStorage.getItem(QUEUE_KEY);
    return safeParse<OfflineQueueItem[]>(raw, []);
  },

  async enqueue(item: Omit<OfflineQueueItem, 'id' | 'createdAt'>) {
    const queue = await this.getQueue();
    const entry: OfflineQueueItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      createdAt: Date.now(),
    };
    queue.push(entry);
    await secureStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  async dequeue(id: string) {
    const queue = await this.getQueue();
    const next = queue.filter((entry) => entry.id !== id);
    await secureStorage.setItem(QUEUE_KEY, JSON.stringify(next));
  },

  async clearQueue() {
    await secureStorage.removeItem(QUEUE_KEY);
  },
};
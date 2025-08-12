import { useState, useCallback, useRef } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface ApiCache {
  [key: string]: CacheItem<any>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useApiCache = () => {
  const cache = useRef<ApiCache>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCacheValid = useCallback((key: string) => {
    const item = cache.current[key];
    if (!item) return false;
    
    const now = Date.now();
    return (now - item.timestamp) < CACHE_DURATION;
  }, []);

  const getCachedData = useCallback(<T>(key: string): T | null => {
    if (isCacheValid(key)) {
      return cache.current[key].data;
    }
    return null;
  }, [isCacheValid]);

  const setCachedData = useCallback(<T>(key: string, data: T) => {
    cache.current[key] = {
      data,
      timestamp: Date.now()
    };
  }, []);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      delete cache.current[key];
    } else {
      cache.current = {};
    }
  }, []);

  const fetchWithCache = useCallback(async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    forceRefresh: boolean = false
  ): Promise<T> => {
    // Verificar cache primero
    if (!forceRefresh) {
      const cachedData = getCachedData<T>(key);
      if (cachedData !== null) {
        console.log(`📦 Usando cache para: ${key}`);
        return cachedData;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`🌐 Haciendo petición para: ${key}`);
      const data = await fetchFn();
      
      // Guardar en cache
      setCachedData(key, data);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  return {
    fetchWithCache,
    getCachedData,
    setCachedData,
    clearCache,
    isCacheValid,
    loading,
    error
  };
}; 
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  CloudflareSimulator, 
  getSimulator, 
  resetSimulator 
} from '../lib/cloudflare-simulator';
import { 
  CFCacheStatus, 
  CacheStrategy, 
  SimulatedResponse, 
  RequestLog,
  SimulatorConfig 
} from '../types';

interface UseCloudflareSimulationOptions {
  cacheStrategy?: CacheStrategy;
  cacheMaxAge?: number;
  staleWhileRevalidate?: number;
  earlyHintsEnabled?: boolean;
}

interface UseCloudflareSimulationReturn {
  // State
  isLoading: boolean;
  lastResponse: SimulatedResponse | null;
  cacheStatus: CFCacheStatus;
  responseTime: number;
  requestHistory: RequestLog[];
  
  // Metrics
  cacheHits: number;
  cacheMisses: number;
  originCalls: number;
  hitRate: number;
  avgResponseTime: number;
  
  // Background revalidation
  isRevalidating: boolean;
  revalidationTime: number | null;
  
  // Actions
  fetchData: (url: string, data: unknown) => Promise<SimulatedResponse>;
  clearCache: () => void;
  reset: () => void;
  updateConfig: (config: Partial<SimulatorConfig>) => void;
  simulateStatus: (status: CFCacheStatus, data: unknown) => Promise<SimulatedResponse>;
}

export function useCloudflareSimulation(
  options: UseCloudflareSimulationOptions = {}
): UseCloudflareSimulationReturn {
  const {
    cacheStrategy = 'basic',
    cacheMaxAge = 60,
    staleWhileRevalidate = 30,
    earlyHintsEnabled = false
  } = options;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<SimulatedResponse | null>(null);
  const [cacheStatus, setCacheStatus] = useState<CFCacheStatus>('DYNAMIC');
  const [responseTime, setResponseTime] = useState(0);
  const [requestHistory, setRequestHistory] = useState<RequestLog[]>([]);
  
  // Revalidation state
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [revalidationTime, setRevalidationTime] = useState<number | null>(null);
  
  // Metrics state
  const [metrics, setMetrics] = useState({
    cacheHits: 0,
    cacheMisses: 0,
    originCalls: 0,
    hitRate: 0,
    avgResponseTime: 0
  });

  // Simulator ref
  const simulatorRef = useRef<CloudflareSimulator | null>(null);
  const requestIdRef = useRef(0);

  // Initialize simulator
  useEffect(() => {
    simulatorRef.current = getSimulator({
      cacheEnabled: cacheStrategy !== 'none',
      cacheStrategy,
      cacheMaxAge,
      staleWhileRevalidate,
      earlyHintsEnabled
    });

    // Revalidation callback
    simulatorRef.current.setRevalidationCallback((key) => {
      setIsRevalidating(false);
      setRevalidationTime(Date.now());
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Update config when options change
  useEffect(() => {
    if (simulatorRef.current) {
      simulatorRef.current.updateConfig({
        cacheEnabled: cacheStrategy !== 'none',
        cacheStrategy,
        cacheMaxAge,
        staleWhileRevalidate,
        earlyHintsEnabled
      });
    }
  }, [cacheStrategy, cacheMaxAge, staleWhileRevalidate, earlyHintsEnabled]);

  // Fetch data
  const fetchData = useCallback(async (url: string, data: unknown): Promise<SimulatedResponse> => {
    if (!simulatorRef.current) {
      throw new Error('Simulator not initialized');
    }

    setIsLoading(true);
    const startTime = performance.now();

    try {
      const response = await simulatorRef.current.fetch(url, data);
      const duration = performance.now() - startTime;

      // Update state
      setLastResponse(response);
      setCacheStatus(response.cacheStatus);
      setResponseTime(response.responseTime);
      
      if (response.backgroundRevalidating) {
        setIsRevalidating(true);
      }

      // Add to history
      const requestLog: RequestLog = {
        id: `req-${++requestIdRef.current}`,
        timestamp: Date.now(),
        url,
        cacheStatus: response.cacheStatus,
        responseTime: response.responseTime,
        fromCache: response.fromCache
      };
      setRequestHistory(prev => [...prev, requestLog]);

      // Update metrics
      const newMetrics = simulatorRef.current.getMetrics();
      setMetrics({
        cacheHits: newMetrics.cacheHits,
        cacheMisses: newMetrics.cacheMisses,
        originCalls: newMetrics.totalRequests - newMetrics.cacheHits,
        hitRate: newMetrics.hitRate,
        avgResponseTime: newMetrics.avgResponseTime
      });

      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    if (simulatorRef.current) {
      simulatorRef.current.clearCache();
      setCacheStatus('DYNAMIC');
      setRevalidationTime(null);
    }
  }, []);

  // Reset everything
  const reset = useCallback(() => {
    if (simulatorRef.current) {
      simulatorRef.current.reset();
    }
    setLastResponse(null);
    setCacheStatus('DYNAMIC');
    setResponseTime(0);
    setRequestHistory([]);
    setIsRevalidating(false);
    setRevalidationTime(null);
    setMetrics({
      cacheHits: 0,
      cacheMisses: 0,
      originCalls: 0,
      hitRate: 0,
      avgResponseTime: 0
    });
    requestIdRef.current = 0;
  }, []);

  // Update config
  const updateConfig = useCallback((config: Partial<SimulatorConfig>) => {
    if (simulatorRef.current) {
      simulatorRef.current.updateConfig(config);
    }
  }, []);

  // Simulate specific status (for demo)
  const simulateStatus = useCallback(async (status: CFCacheStatus, data: unknown): Promise<SimulatedResponse> => {
    if (!simulatorRef.current) {
      throw new Error('Simulator not initialized');
    }

    setIsLoading(true);
    
    try {
      const response = await simulatorRef.current.simulateStatus(status, data);
      
      setLastResponse(response);
      setCacheStatus(response.cacheStatus);
      setResponseTime(response.responseTime);
      
      // Add to history
      const requestLog: RequestLog = {
        id: `req-${++requestIdRef.current}`,
        timestamp: Date.now(),
        url: 'simulated',
        cacheStatus: response.cacheStatus,
        responseTime: response.responseTime,
        fromCache: response.fromCache
      };
      setRequestHistory(prev => [...prev, requestLog]);

      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    lastResponse,
    cacheStatus,
    responseTime,
    requestHistory,
    
    // Metrics
    cacheHits: metrics.cacheHits,
    cacheMisses: metrics.cacheMisses,
    originCalls: metrics.originCalls,
    hitRate: metrics.hitRate,
    avgResponseTime: metrics.avgResponseTime,
    
    // Revalidation
    isRevalidating,
    revalidationTime,
    
    // Actions
    fetchData,
    clearCache,
    reset,
    updateConfig,
    simulateStatus
  };
}


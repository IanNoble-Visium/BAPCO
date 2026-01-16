import { useState, useEffect, useCallback } from 'react';
import { mockData, simulateRealTimeData } from '../data/mockData';
import { useAppState } from '../context/AppStateContext';

export function useRealTimeData(updateInterval = 5000) {
  const [data, setData] = useState(mockData);
  const { realTimeEnabled } = useAppState();

  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      setData(prevData => simulateRealTimeData(prevData));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [realTimeEnabled, updateInterval]);

  const refreshData = useCallback(() => {
    setData(simulateRealTimeData(data));
  }, [data]);

  return { data, refreshData };
}

export function useAnimatedValue(targetValue, duration = 1000) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startValue = displayValue;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (targetValue - startValue) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return displayValue;
}

export default useRealTimeData;

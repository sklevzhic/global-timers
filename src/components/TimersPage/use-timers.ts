import { useState, useCallback } from 'react';

export function useTimers() {
  const [timers, setTimers] = useState<number[]>([]);

  const addTimer = useCallback(() => {
    setTimers(prev => [...prev, prev.length]);
  }, []);

  const removeLastTimer = useCallback(() => {
    if (timers.length > 0) {
      setTimers(prev => prev.slice(0, -1));
    }
  }, [timers.length]);

  const clearAllTimers = useCallback(() => {
    setTimers([]);
  }, []);

  return {
    timers,
    addTimer,
    removeLastTimer,
    clearAllTimers,
    timerCount: timers.length,
  };
}

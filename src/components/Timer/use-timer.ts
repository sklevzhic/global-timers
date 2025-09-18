import { useState, useEffect, useRef } from 'react';
import { timerTicker } from './timer-ticker';

export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerIdRef = useRef<string | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const timerId = `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    timerIdRef.current = timerId;

    timerTicker.addTimer(timerId, () => {
      if (startTimeRef.current !== null) {
        const currentTime = accumulatedTimeRef.current + (performance.now() - startTimeRef.current);
        setTime(currentTime);
      }
    });

    return () => {
      timerTicker.removeTimer(timerId);
    };
  }, [isRunning]);

  const start = () => {
    if (!isRunning) {
      startTimeRef.current = performance.now();
      setIsRunning(true);
    }
  };

  const pause = () => {
    if (isRunning) {
      if (startTimeRef.current !== null) {
        accumulatedTimeRef.current += performance.now() - startTimeRef.current;
      }
      setIsRunning(false);
    }
  };

  const toggle = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const reset = () => {
    startTimeRef.current = null;
    accumulatedTimeRef.current = 0;
    setTime(0);
    setIsRunning(false);
  };

  return {
    time, 
    isRunning,
    formattedTime: _formatTime(time),
    timerId: timerIdRef.current,
    start,
    pause,
    toggle,
    reset,
  };
}

function _formatTime(ms: number) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

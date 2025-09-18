import { useState, useEffect, useRef } from 'react';

class TimerTicker {
  private interval: NodeJS.Timeout | null = null;
  private timers = new Map<string, () => void>();
  private isPageVisible = true;
  private readonly ACTIVE_INTERVAL = 100;
  private readonly INACTIVE_INTERVAL = 1000;

  constructor() {
    this.setupVisibilityListener();
  }

  private setupVisibilityListener() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        this.isPageVisible = !document.hidden;
        this._updateInterval();
      });
    }
  }

  private _updateInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      const interval = this.isPageVisible ? this.ACTIVE_INTERVAL : this.INACTIVE_INTERVAL;
      this.interval = setInterval(() => {
        this.timers.forEach(callback => callback());
      }, interval);
    }
  }

  addTimer(id: string, callback: () => void): () => void {
    this.timers.set(id, callback);

    if (!this.interval) {
      const interval = this.isPageVisible ? this.ACTIVE_INTERVAL : this.INACTIVE_INTERVAL;
      this.interval = setInterval(() => {
        this.timers.forEach(callback => callback());
      }, interval);
    }

    return () => this.removeTimer(id);
  }

  removeTimer(id: string): void {
    this.timers.delete(id);

    if (this.timers.size === 0) {
      clearInterval(this.interval!);
      this.interval = null;
    }
  }

  hasTimer(id: string): boolean {
    return this.timers.has(id);
  }

  getTimerCount(): number {
    return this.timers.size;
  }
}

const timerTicker = new TimerTicker();

export function useTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerIdRef = useRef<string | null>(null);

  // момент времени когда таймер был запущен/возобновлен
  const startTimeRef = useRef<number | null>(null);
  // общее время работы таймера за все сеансы
  const accumulatedTimeRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const timerId = `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    timerIdRef.current = timerId;

    timerTicker.addTimer(timerId, () => {
      if (startTimeRef.current !== null) {
        // Вычисляем текущее время: накопленное + время с последнего старта
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
        // Сохраняем накопленное время
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
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

export const timerTicker = new TimerTicker();

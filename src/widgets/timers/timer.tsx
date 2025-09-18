'use client';

import { useTimer } from './use-timer';

export function Timer() {
  const { isRunning, formattedTime, toggle, reset } = useTimer();

  return (
    <div className="timer-card">
      <div className="timer-display">
        {formattedTime}
      </div>
      
      <div className="timer-buttons">
        <button
          onClick={toggle}
          className="timer-btn start-pause-btn"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={reset}
          className="timer-btn reset-btn"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
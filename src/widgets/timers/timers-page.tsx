'use client';

import { useState } from 'react';
import { Timer } from './timer';

export function TimersPage() {
  const [timers, setTimers] = useState<number[]>([]);

  const addTimer = () => {
    setTimers(prev => [...prev, prev.length]);
  };

  const removeLastTimer = () => {
    if (timers.length > 0) {
      setTimers(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="timers-page">
      <div className="timers-header">
        <h1 className="timers-title">Multi Timer</h1>
        <div className="timer-controls">
          <button
            onClick={addTimer}
            className="add-timer-btn"
          >
            Add Timer
          </button>
          
          <button
            onClick={removeLastTimer}
            disabled={timers.length === 0}
            className="remove-timer-btn"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="timers-grid">
        {timers.map((timerIndex) => (
          <Timer
            key={timerIndex}
          />
        ))}
      </div>

      {timers.length === 0 && (
        <div className="no-timers">
          <p>No timers</p>
        </div>
      )}
    </div>
  );
}

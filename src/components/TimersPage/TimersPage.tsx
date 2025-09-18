'use client';

import { Timer } from '../Timer';
import { useTimers } from './use-timers';

export function TimersPage() {
  const { timers, addTimer, removeLastTimer } = useTimers();

  return (
    <div className="multi-timer-app">
      <div className="multi-timer-header">
        <h1 className="multi-timer-title">Multi Timer</h1>
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

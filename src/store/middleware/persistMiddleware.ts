import type { Middleware } from '@reduxjs/toolkit';
import type { HistoryDataPoint } from '../slices/historySlice';

// Auto-save to localStorage every N new points
let saveCounter = 0;
const SAVE_INTERVAL = 10;

export const persistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (typeof action === 'object' && action !== null && 'type' in action) {
    const actionType = (action as { type: string }).type;

    if (actionType === 'history/addHistoryPoint') {
      saveCounter++;
      if (saveCounter >= SAVE_INTERVAL) {
        saveCounter = 0;
        const state = store.getState() as { history: { points: HistoryDataPoint[] } };
        try {
          localStorage.setItem('kwh-history', JSON.stringify(state.history.points));
        } catch {
          // storage full or unavailable
        }
      }
    }
  }

  return result;
};

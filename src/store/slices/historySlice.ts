import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DataPoint } from '../../types/meterData';

export interface HistoryDataPoint extends DataPoint {
  timestamp: number; // epoch ms
}

interface HistoryState {
  points: HistoryDataPoint[];
}

function loadFromStorage(): HistoryDataPoint[] {
  try {
    const raw = localStorage.getItem('kwh-history');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // corrupted data, start fresh
  }
  return [];
}

const initialState: HistoryState = {
  points: loadFromStorage(),
};

const MAX_POINTS = 5000; // ~5.5 jam data di polling 4 detik

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryPoint(state, action: PayloadAction<HistoryDataPoint>) {
      state.points.push(action.payload);
      if (state.points.length > MAX_POINTS) {
        state.points = state.points.slice(-MAX_POINTS);
      }
    },
    clearHistory(state) {
      state.points = [];
      try { localStorage.removeItem('kwh-history'); } catch { /* ignore */ }
    },
  },
});

export const { addHistoryPoint, clearHistory } = historySlice.actions;
export default historySlice.reducer;

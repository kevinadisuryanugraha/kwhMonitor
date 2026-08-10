import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SystemState {
  isOnline: boolean;
  successCount: number;
  latency: number;
  lastUpdated: string;
}

const initialState: SystemState = {
  isOnline: true,
  successCount: 0,
  latency: 0,
  lastUpdated: 'Belum ada data',
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    updateSystemMetrics(state, action: PayloadAction<{ latency: number; lastUpdated: string }>) {
      state.latency = action.payload.latency;
      state.lastUpdated = action.payload.lastUpdated;
    },
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
    incrementSuccess(state) {
      state.successCount += 1;
    },
  },
});

export const { updateSystemMetrics, setOnlineStatus, incrementSuccess } = systemSlice.actions;
export default systemSlice.reducer;

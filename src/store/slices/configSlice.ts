import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppConfig } from '../../types/config';

const initialState: AppConfig = {
  deviceId: 'E83DC19F498C',
  apiUrl: 'https://kwhmeter2.pojiweb.online/api/web/data?id=E83DC19F498C',
  intervalSec: 4,
  isDemoMode: false,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setDeviceId(state, action: PayloadAction<string>) {
      state.deviceId = action.payload;
    },
    setInterval(state, action: PayloadAction<number>) {
      state.intervalSec = Math.max(2, Math.min(action.payload, 60));
    },
    setApiUrl(state, action: PayloadAction<string>) {
      state.apiUrl = action.payload;
    },
    toggleDemo(state) {
      state.isDemoMode = !state.isDemoMode;
    },
  },
});

export const { setDeviceId, setInterval, setApiUrl, toggleDemo } = configSlice.actions;
export default configSlice.reducer;

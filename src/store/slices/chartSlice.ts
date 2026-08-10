import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DataPoint } from '../../types/meterData';
import type { ChartMetric } from '../../types/config';

interface ChartState {
  activeMetric: ChartMetric;
  history: DataPoint[];
}

const initialState: ChartState = {
  activeMetric: 'w',
  history: [],
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    pushDataPoint(state, action: PayloadAction<DataPoint>) {
      state.history.push(action.payload);
      if (state.history.length > 20) {
        state.history.shift();
      }
    },
    setActiveMetric(state, action: PayloadAction<ChartMetric>) {
      state.activeMetric = action.payload;
    },
  },
});

export const { pushDataPoint, setActiveMetric } = chartSlice.actions;
export default chartSlice.reducer;

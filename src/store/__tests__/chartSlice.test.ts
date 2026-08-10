import { describe, it, expect } from 'vitest';
import chartReducer, { pushDataPoint, setActiveMetric } from '../slices/chartSlice';
import type { DataPoint } from '../../types/meterData';
import type { ChartMetric } from '../../types/config';

describe('chartSlice', () => {
  const initialState = {
    activeMetric: 'w' as ChartMetric,
    history: [] as DataPoint[],
  };

  it('handles setActiveMetric', () => {
    const next = chartReducer(initialState, setActiveMetric('v'));
    expect(next.activeMetric).toBe('v');
  });

  it('adds data point to history', () => {
    const point: DataPoint = { v: 220, a: 2.5, w: 500, sld: 50, time: '14:30:00' };
    const next = chartReducer(initialState, pushDataPoint(point));
    expect(next.history).toHaveLength(1);
    expect(next.history[0].w).toBe(500);
  });

  it('caps history at 20 items', () => {
    let state = initialState;
    for (let i = 0; i < 25; i++) {
      const point: DataPoint = { v: 220, a: 2, w: i * 10, sld: 50, time: `${i}:00` };
      state = chartReducer(state, pushDataPoint(point));
    }
    expect(state.history).toHaveLength(20);
    expect(state.history[19].w).toBe(240);
  });
});

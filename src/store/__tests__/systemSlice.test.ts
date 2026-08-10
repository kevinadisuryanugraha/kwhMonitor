import { describe, it, expect } from 'vitest';
import systemReducer, { updateSystemMetrics, setOnlineStatus, incrementSuccess } from '../slices/systemSlice';

describe('systemSlice', () => {
  const initialState = {
    isOnline: true,
    successCount: 0,
    latency: 0,
    lastUpdated: 'Belum ada data',
  };

  it('handles setOnlineStatus true', () => {
    const next = systemReducer({ ...initialState, isOnline: false }, setOnlineStatus(true));
    expect(next.isOnline).toBe(true);
  });

  it('handles setOnlineStatus false', () => {
    const next = systemReducer(initialState, setOnlineStatus(false));
    expect(next.isOnline).toBe(false);
  });

  it('handles incrementSuccess', () => {
    const next = systemReducer(initialState, incrementSuccess());
    expect(next.successCount).toBe(1);
  });

  it('handles updateSystemMetrics', () => {
    const next = systemReducer(initialState, updateSystemMetrics({ latency: 150, lastUpdated: '14:30:00 WIB' }));
    expect(next.latency).toBe(150);
    expect(next.lastUpdated).toBe('14:30:00 WIB');
  });
});

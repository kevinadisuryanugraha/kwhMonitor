import { describe, it, expect } from 'vitest';
import configReducer, { setDeviceId, setInterval, setApiUrl, toggleDemo } from '../slices/configSlice';

describe('configSlice', () => {
  const initialState = {
    deviceId: 'E83DC19F498C',
    apiUrl: 'https://kwhmeter2.pojiweb.online/api/web/data?id=E83DC19F498C',
    intervalSec: 4,
    isDemoMode: false,
  };

  it('handles setDeviceId', () => {
    const next = configReducer(initialState, setDeviceId('TEST123'));
    expect(next.deviceId).toBe('TEST123');
  });

  it('handles setInterval with valid value', () => {
    const next = configReducer(initialState, setInterval(10));
    expect(next.intervalSec).toBe(10);
  });

  it('clamps setInterval to minimum 2', () => {
    const next = configReducer(initialState, setInterval(1));
    expect(next.intervalSec).toBe(2);
  });

  it('handles setApiUrl', () => {
    const next = configReducer(initialState, setApiUrl('http://test.com'));
    expect(next.apiUrl).toBe('http://test.com');
  });

  it('handles toggleDemo', () => {
    const next = configReducer(initialState, toggleDemo());
    expect(next.isDemoMode).toBe(true);
    const back = configReducer(next, toggleDemo());
    expect(back.isDemoMode).toBe(false);
  });
});

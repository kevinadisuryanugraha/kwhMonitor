import { describe, it, expect } from 'vitest';
import {
  calcVoltageDelta,
  calcCurrentLoadPct,
  calcCostPerHour,
  calcDaysLeft,
  calcApparentPower,
  getVoltageStatus,
  getCurrentLoadStatus,
  getTokenStatus,
} from '../calculations';

describe('calcVoltageDelta', () => {
  it('returns positive percentage for voltage above 220', () => {
    expect(calcVoltageDelta(231)).toBe(5.0);
  });
  it('returns negative percentage for voltage below 220', () => {
    expect(calcVoltageDelta(209)).toBe(-5.0);
  });
  it('returns 0 for exactly 220', () => {
    expect(calcVoltageDelta(220)).toBe(0);
  });
});

describe('calcCurrentLoadPct', () => {
  it('calculates load percentage against 10A max', () => {
    expect(calcCurrentLoadPct(5)).toBe(50);
  });
  it('caps at 100', () => {
    expect(calcCurrentLoadPct(15)).toBe(100);
  });
  it('returns 0 for 0 current', () => {
    expect(calcCurrentLoadPct(0)).toBe(0);
  });
});

describe('calcCostPerHour', () => {
  it('calculates cost based on Rp 1.444,70 per kWh', () => {
    const cost = calcCostPerHour(1000);
    expect(cost).toBe(1445);
  });
  it('returns 0 for zero power', () => {
    expect(calcCostPerHour(0)).toBe(0);
  });
});

describe('calcDaysLeft', () => {
  it('estimates days left based on current power draw', () => {
    const days = calcDaysLeft(50, 100);
    expect(days).toBeCloseTo(20.8, 1);
  });
  it('returns Infinity for zero power', () => {
    expect(calcDaysLeft(10, 0)).toBe(Infinity);
  });
});

describe('calcApparentPower', () => {
  it('calculates VA = V * A', () => {
    expect(calcApparentPower(220, 2.5)).toBe(550);
  });
  it('handles zero values', () => {
    expect(calcApparentPower(0, 5)).toBe(0);
  });
});

describe('getVoltageStatus', () => {
  it('returns Normal for 220V', () => {
    expect(getVoltageStatus(220)).toEqual({ label: 'Normal', className: 'text-emerald-400 font-medium' });
  });
  it('returns Rendah for below 200V', () => {
    expect(getVoltageStatus(190).label).toBe('Rendah (Under-voltage)');
  });
  it('returns Tinggi for above 240V', () => {
    expect(getVoltageStatus(250).label).toBe('Tinggi (Over-voltage)');
  });
});

describe('getCurrentLoadStatus', () => {
  it('returns Ringan for current <= 4', () => {
    expect(getCurrentLoadStatus(3).label).toBe('Ringan');
  });
  it('returns Sedang for current <= 8', () => {
    expect(getCurrentLoadStatus(6).label).toBe('Sedang');
  });
  it('returns Tinggi for current > 8', () => {
    expect(getCurrentLoadStatus(9).label).toBe('Tinggi / Beban Berat');
  });
});

describe('getTokenStatus', () => {
  it('returns KRITIS for token < 10', () => {
    const result = getTokenStatus(5);
    expect(result.label).toBe('KRITIS');
    expect(result.isLow).toBe(true);
  });
  it('returns Cukup for token >= 10', () => {
    const result = getTokenStatus(15);
    expect(result.label).toBe('Cukup');
    expect(result.isLow).toBe(false);
  });
});

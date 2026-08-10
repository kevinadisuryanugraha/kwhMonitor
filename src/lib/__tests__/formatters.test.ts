import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatTimestamp } from '../formatters';

describe('formatNumber', () => {
  it('formats voltage to 1 decimal', () => {
    expect(formatNumber(220, 1)).toBe('220.0');
  });
  it('formats current to 2 decimals', () => {
    expect(formatNumber(1.256, 2)).toBe('1.26');
  });
});

describe('formatCurrency', () => {
  it('formats number to IDR currency', () => {
    expect(formatCurrency(1445)).toBe('Rp 1.445');
  });
  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('Rp 0');
  });
});

describe('formatTimestamp', () => {
  it('formats date to WIB time string', () => {
    const date = new Date('2026-08-10T14:30:00+07:00');
    const result = formatTimestamp(date);
    expect(result).toContain('14:30');
    expect(result).toContain('WIB');
  });
});

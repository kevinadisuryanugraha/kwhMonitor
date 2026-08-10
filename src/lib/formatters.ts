export function formatNumber(value: number, decimals: number): string {
  if (!isFinite(value)) return '--';
  return value.toFixed(decimals);
}

export function formatCurrency(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export function formatTimestamp(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss} WIB`;
}

export function formatLatency(ms: number): string {
  return ms > 10000 ? '>10s' : `${ms} ms`;
}

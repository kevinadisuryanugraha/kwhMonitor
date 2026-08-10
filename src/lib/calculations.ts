const REFERENCE_VOLTAGE = 220;
const MAX_CURRENT = 10;
const PRICE_PER_KWH = 1444.70;

export function calcVoltageDelta(v: number): number {
  return parseFloat((((v - REFERENCE_VOLTAGE) / REFERENCE_VOLTAGE) * 100).toFixed(1));
}

export function calcCurrentLoadPct(a: number): number {
  return Math.min(Math.round((a / MAX_CURRENT) * 100), 100);
}

export function calcCostPerHour(w: number): number {
  const kwhPerHour = w / 1000;
  return Math.round(kwhPerHour * PRICE_PER_KWH);
}

export function calcDaysLeft(sld: number, w: number): number {
  if (w <= 0) return Infinity;
  const kwhPerDay = (w * 24) / 1000;
  return parseFloat((sld / kwhPerDay).toFixed(1));
}

export function calcApparentPower(v: number, a: number): number {
  return Math.round(v * a);
}

export function calcPowerFactor(w: number, va: number): string {
  if (va <= 0) return 'PF 1.00';
  const pf = w / va;
  return `PF ${pf.toFixed(2)}`;
}

export function getVoltageStatus(v: number): { label: string; className: string } {
  if (v < 200) return { label: 'Rendah (Under-voltage)', className: 'text-amber-400 font-medium' };
  if (v > 240) return { label: 'Tinggi (Over-voltage)', className: 'text-red-400 font-medium' };
  return { label: 'Normal', className: 'text-emerald-400 font-medium' };
}

export function getCurrentLoadStatus(a: number): { label: string; className: string } {
  if (a > 8) return { label: 'Tinggi / Beban Berat', className: 'text-red-400 font-medium' };
  if (a > 4) return { label: 'Sedang', className: 'text-amber-400 font-medium' };
  return { label: 'Ringan', className: 'text-emerald-400 font-medium' };
}

export function getTokenStatus(sld: number): { label: string; className: string; isLow: boolean } {
  if (sld < 10) return { label: 'KRITIS', className: 'text-red-400 font-bold animate-pulse', isLow: true };
  return { label: 'Cukup', className: 'text-emerald-400 font-semibold', isLow: false };
}

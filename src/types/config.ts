export type ChartMetric = 'v' | 'a' | 'w' | 'sld';

export interface AppConfig {
  deviceId: string;
  apiUrl: string;
  intervalSec: number;
  isDemoMode: boolean;
}

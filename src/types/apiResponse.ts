import type { MeterData } from './meterData';

export interface ApiResponse {
  success?: boolean;
  data?: MeterData;
}

export interface ProxyResponse {
  success: boolean;
  error?: string;
  details?: string;
  v?: number;
  a?: number;
  w?: number;
  sld?: number;
}

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { MeterData } from '../../types/meterData';
import type { ProxyResponse } from '../../types/apiResponse';
import type { RootState } from '../index';

function extractApiData(json: unknown): MeterData {
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid response structure');
  }

  const obj = json as Record<string, unknown>;

  // Case 1: { success: true, data: { v, a, w, sld } }
  if (obj.data && typeof obj.data === 'object') {
    const d = obj.data as Record<string, unknown>;
    return {
      v: parseNumber(d.v),
      a: parseNumber(d.a),
      w: parseNumber(d.w),
      sld: parseNumber(d.sld),
    };
  }

  // Case 2: { v, a, w, sld } directly
  if ('v' in obj || 'a' in obj || 'w' in obj || 'sld' in obj) {
    return {
      v: parseNumber(obj.v),
      a: parseNumber(obj.a),
      w: parseNumber(obj.w),
      sld: parseNumber(obj.sld),
    };
  }

  throw new Error('Unable to extract meter data from response');
}

function parseNumber(val: unknown, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  const num = Number(val);
  return isNaN(num) ? fallback : num;
}

function generateDemoData(): MeterData {
  const baseV = 220 + (Math.random() * 4 - 2);
  const baseA = 1.25 + (Math.random() * 0.4 - 0.2);
  const baseW = baseV * baseA * (0.92 + Math.random() * 0.05);
  const currentToken = 12.40 + (Math.random() * 0.2 - 0.1);

  return {
    v: parseFloat(baseV.toFixed(1)),
    a: parseFloat(baseA.toFixed(2)),
    w: parseFloat(baseW.toFixed(1)),
    sld: parseFloat(currentToken.toFixed(2)),
  };
}

export const kwhApi = createApi({
  reducerPath: 'kwhApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getMeterData: builder.query<
      MeterData,
      { deviceId: string; apiUrl: string; isDemoMode: boolean }
    >({
      queryFn: async (params, _api, _extraOptions, baseQuery) => {
        const { deviceId, apiUrl, isDemoMode } = params;

        if (isDemoMode) {
          await new Promise((r) => setTimeout(r, 300));
          return { data: generateDemoData() };
        }

        // Try direct API first
        try {
          const directResult = await fetch(apiUrl, {
            method: 'GET',
            headers: { Accept: 'application/json' },
          });

          if (directResult.ok) {
            const json = await directResult.json();
            return { data: extractApiData(json) };
          }
        } catch {
          // Direct fetch failed, fall through to proxy
        }

        // Fallback: proxy
        const proxyResult = await baseQuery(
          `/api/kwh-proxy?id=${encodeURIComponent(deviceId)}`
        );

        if (proxyResult.error) {
          return { error: proxyResult.error };
        }

        const proxyJson = proxyResult.data as ProxyResponse;
        return { data: extractApiData(proxyJson) };
      },
    }),
  }),
});

export const { useGetMeterDataQuery } = kwhApi;

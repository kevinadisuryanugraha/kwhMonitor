import { configureStore } from '@reduxjs/toolkit';
import configReducer from './slices/configSlice';
import systemReducer from './slices/systemSlice';
import chartReducer from './slices/chartSlice';
import historyReducer from './slices/historySlice';
import { kwhApi } from './api/kwhApi';
import { persistMiddleware } from './middleware/persistMiddleware';

export function configureAppStore() {
  return configureStore({
    reducer: {
      config: configReducer,
      system: systemReducer,
      chart: chartReducer,
      history: historyReducer,
      [kwhApi.reducerPath]: kwhApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(kwhApi.middleware, persistMiddleware),
  });
}

export type RootState = ReturnType<ReturnType<typeof configureAppStore>['getState']>;
export type AppDispatch = ReturnType<typeof configureAppStore>['dispatch'];

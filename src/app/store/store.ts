import { configureStore } from '@reduxjs/toolkit'
import { productsApi } from '../../shared/api/productsApi'

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
})

// Отключаем автоматический рефетч при фокусе и reconnect
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
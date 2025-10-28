import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
}

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  per_page: number
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://noxer-test.ru/webapp/api/',
  }),
  tagTypes: ['Products'],
  // Глобально отключаем все автоматические рефетчи
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    getMainProducts: builder.query<Product[], void>({
      query: () => 'products/on_main',
      providesTags: ['Products'],
      // Долгое хранение данных
      keepUnusedDataFor: 60 * 60, // 1 час
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return response
        } else if (response && Array.isArray(response.products)) {
          return response.products
        } else if (response && Array.isArray(response.data)) {
          return response.data
        }
        return []
      },
    }),
    
    getFilteredProducts: builder.query<
      ProductsResponse,
      { page?: number; per_page?: number; search: string }
    >({
      query: ({ page = 1, per_page = 20, search }) => ({
        url: 'products/filter',
        method: 'POST',
        body: { search },
        params: { page, per_page },
      }),
      providesTags: ['Products'],
      // Для поиска включаем рефетч только при изменении аргументов
      refetchOnMountOrArgChange: true,
      keepUnusedDataFor: 300, // 5 минут
      transformResponse: (response: any) => {
        if (response && Array.isArray(response.products)) {
          return {
            products: response.products,
            total: response.total || response.products.length,
            page: response.page || 1,
            per_page: response.per_page || 20
          }
        } else if (Array.isArray(response)) {
          return {
            products: response,
            total: response.length,
            page: 1,
            per_page: 20
          }
        }
        return {
          products: [],
          total: 0,
          page: 1,
          per_page: 20
        }
      },
    }),
  }),
})

export const { useGetMainProductsQuery, useGetFilteredProductsQuery } = productsApi
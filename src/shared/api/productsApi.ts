import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://noxer-test.ru/webapp/api/",
  }),
  tagTypes: ["Products"],
  // Отключаем все автоматические рефетчи
  refetchOnMountOrArgChange: false,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  endpoints: (builder) => ({
    // GET запрос для основных товаров - с отключенной автоматической загрузкой
    getMainProducts: builder.query<Product[], void>({
      query: () => "products/on_main",
      providesTags: ["Products"],
    }),

    // POST запрос для фильтрации товаров
    getFilteredProducts: builder.query<
      ProductsResponse,
      { page?: number; per_page?: number; search: string }
    >({
      query: ({ page = 1, per_page = 20, search }) => ({
        url: "products/filter",
        method: "POST",
        body: { search },
        params: { page, per_page },
      }),
      providesTags: ["Products"],
    }),
  }),
});

// Экспортируем обычные и lazy хуки
export const { 
  useGetMainProductsQuery, 
  useGetFilteredProductsQuery,
  useLazyGetMainProductsQuery, // Этот хук генерируется автоматически
  useLazyGetFilteredProductsQuery // Этот хук генерируется автоматически
} = productsApi;
import { useState, useEffect, useCallback } from 'react'

export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  per_page: number
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загружаем продукты только один раз при монтировании
  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://noxer-test.ru/webapp/api/products/on_main')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Нормализуем данные
      let productsData: Product[] = []
      if (Array.isArray(data)) {
        productsData = data
      } else if (data && Array.isArray(data.products)) {
        productsData = data.products
      } else if (data && Array.isArray(data.data)) {
        productsData = data.data
      }
      
      setProducts(productsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Поиск продуктов
  const searchProducts = useCallback(async (search: string, page: number = 1, per_page: number = 20): Promise<ProductsResponse> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://noxer-test.ru/webapp/api/products/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Нормализуем данные
      let productsData: Product[] = []
      let total = 0
      
      if (data && Array.isArray(data.products)) {
        productsData = data.products
        total = data.total || data.products.length
      } else if (Array.isArray(data)) {
        productsData = data
        total = data.length
      }
      
      return {
        products: productsData,
        total,
        page,
        per_page
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка поиска')
      console.error('Error searching products:', err)
      return {
        products: [],
        total: 0,
        page,
        per_page
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Загружаем продукты при первом рендере
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return {
    products,
    loading,
    error,
    searchProducts,
    refetch: loadProducts
  }
}
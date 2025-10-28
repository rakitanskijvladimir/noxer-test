import { useState, useEffect, useMemo } from 'react'
import { mockProducts } from '../../entities/product/mockData'
import { Product, ProductsResponse } from '../../entities/product/types'

export const useProducts = () => {
  const [data, setData] = useState<Product[]>(mockProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Имитируем загрузку только при первом рендере
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 500))
        setData(mockProducts)
      } catch (err) {
        setError('Ошибка загрузки товаров')
        console.error('Error fetching products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, []) // Пустой массив зависимостей - загружаем только один раз

  const searchProducts = useMemo(() => 
    (searchTerm: string, page: number = 1, perPage: number = 20): ProductsResponse => {
      if (!searchTerm.trim()) {
        return {
          products: mockProducts,
          total: mockProducts.length,
          page,
          per_page: perPage
        }
      }

      const filtered = mockProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )

      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedProducts = filtered.slice(startIndex, endIndex)

      return {
        products: paginatedProducts,
        total: filtered.length,
        page,
        per_page: perPage
      }
    },
    []
  )

  return {
    products: data,
    isLoading,
    error,
    searchProducts
  }
}
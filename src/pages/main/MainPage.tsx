import React, { useState, useCallback } from 'react'
import { useGetMainProductsQuery, useGetFilteredProductsQuery } from '../../shared/api/productsApi'
import { Search } from '../../features/search/Search'
import { ProductList } from '../../widgets/product-list/ProductList'
import { Pagination } from '../../features/pagination/Pagination'
import { Loader } from '../../shared/ui/loader/Loader'
import styles from './MainPage.module.scss'

export const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 20

  // GET запрос - выполнится только один раз
  const {
    data: mainProducts = [],
    isLoading: mainLoading,
    error: mainError,
  } = useGetMainProductsQuery(undefined, {
    // Явно отключаем все рефетчи для этого запроса
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  })

  // POST запрос - только при поиске
  const {
    data: filteredData,
    isLoading: filteredLoading,
    error: filteredError,
  } = useGetFilteredProductsQuery(
    { 
      search: searchTerm, 
      page: currentPage, 
      per_page: productsPerPage 
    },
    { 
      skip: !searchTerm,
      // Рефетчим только при изменении поискового запроса или страницы
      refetchOnMountOrArgChange: true,
    }
  )

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const isLoading = mainLoading || filteredLoading
  const error = mainError || filteredError

  const displayProducts = searchTerm 
    ? (filteredData?.products || [])
    : mainProducts

  const totalPages = searchTerm 
    ? Math.ceil((filteredData?.total || 0) / productsPerPage)
    : 1

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Произошла ошибка при загрузке товаров</h2>
        <p>Проверьте подключение к интернету и попробуйте снова.</p>
      </div>
    )
  }

  return (
    <div className={styles.mainPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Добро пожаловать в Noxer Shop</h1>
        
        <Search onSearch={handleSearch} loading={isLoading} />
        
        {isLoading && <Loader />}
        
        <ProductList 
          products={displayProducts} 
          loading={isLoading}
        />
        
        {searchTerm && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}
import React, { useState, useCallback, useMemo } from 'react'
import styles from './Search.module.scss'

interface SearchProps {
  onSearch: (searchTerm: string) => void
  loading?: boolean
}

const POPULAR_SEARCHES = [
  'Смартфоны',
  'Ноутбуки',
  'Наушники',
  'Телевизоры',
  'Фотокамеры'
]

export const Search: React.FC<SearchProps> = React.memo(({ onSearch, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }, [searchTerm, onSearch])

  const handlePopularSearch = useCallback((term: string) => {
    setSearchTerm(term)
    onSearch(term)
  }, [onSearch])

  const popularSearches = useMemo(() => 
    POPULAR_SEARCHES.map((term, index) => (
      <button
        key={index}
        type="button"
        className={styles.popularItem}
        onClick={() => handlePopularSearch(term)}
        disabled={loading}
      >
        {term}
      </button>
    ))
  , [handlePopularSearch, loading])

  return (
    <div className={styles.search}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск товаров..."
          className={styles.input}
          disabled={loading}
        />
        <button 
          type="submit" 
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </form>
      
      <div className={styles.popular}>
        <h3 className={styles.popularTitle}>Часто ищут:</h3>
        <div className={styles.popularList}>
          {popularSearches}
        </div>
      </div>
    </div>
  )
})
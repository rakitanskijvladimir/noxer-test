import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import styles from './Search.module.scss'

interface SearchProps {
  onSearch: (searchTerm: string) => void
  loading?: boolean
}

const POPULAR_SEARCHES = [
  'футболка',
  'женская кофта',
  'сертификат',
  'куртка',
  'детская футболка',
  'подарочный сертификат',
  'штаны спортивные',
  'сертификат на 1000 рублей',
  'шапка',
  'брелок'
]

export const Search: React.FC<SearchProps> = React.memo(({ onSearch, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const popularRef = useRef<HTMLDivElement>(null)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm)
    }
  }, [searchTerm, onSearch])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    // Автоматический поиск отключен
  }, [])

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true)
  }, [])

  const handleInputBlur = useCallback((e: React.FocusEvent) => {
    if (popularRef.current && !popularRef.current.contains(e.relatedTarget as Node)) {
      setIsInputFocused(false)
    }
  }, [])

  const handlePopularSearch = useCallback((term: string) => {
    setSearchTerm(term)
    onSearch(term)
    setIsInputFocused(false)
  }, [onSearch])

  const handleClosePopular = useCallback(() => {
    setIsInputFocused(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popularRef.current && !popularRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsInputFocused(false)
      }
    }

    if (isInputFocused) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isInputFocused])

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
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Найти товары..."
          className={styles.input}
          disabled={loading}
          autoFocus
        />
      </form>
      
      {isInputFocused && (
        <>
          <div className={styles.overlay} onClick={handleClosePopular} />
          <div ref={popularRef} className={styles.popularContainer}>
            <div className={styles.popularContent}>
              <h3 className={styles.popularTitle}>Часто ищут</h3>
              <div className={styles.popularList}>
                {popularSearches}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
})
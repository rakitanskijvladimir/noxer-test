import React, { useMemo } from 'react'
import { Product } from '../../entities/product/types'
import styles from './ProductList.module.scss'

interface ProductListProps {
  products: Product[] | undefined
  loading?: boolean
}

export const ProductList: React.FC<ProductListProps> = React.memo(({ products, loading = false }) => {
  // Защита от undefined или неправильного формата
  const safeProducts = useMemo((): Product[] => {
    if (!products) return []
    if (Array.isArray(products)) return products
    return []
  }, [products])

  const productItems = useMemo(() => 
    safeProducts.map(product => (
      <div key={product.id} className={styles.productCard}>
        <div className={styles.imageContainer}>
          <img 
            src={product.image || 'https://via.placeholder.com/300x200/007bff/ffffff?text=No+Image'} 
            alt={product.name}
            className={styles.image}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://via.placeholder.com/300x200/007bff/ffffff?text=No+Image'
            }}
          />
          <div className={styles.imageOverlay}>
            <button className={styles.favoriteButton}>
              ♡
            </button>
          </div>
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{product.name || 'Без названия'}</h3>
          <p className={styles.description}>{product.description || 'Описание отсутствует'}</p>
          <div className={styles.footer}>
            <span className={styles.price}>{(product.price || 0).toLocaleString()} ₽</span>
            <button className={styles.cartButton}>В корзину</button>
          </div>
        </div>
      </div>
    ))
  , [safeProducts])

  if (loading) {
    return <div className={styles.loading}>Загрузка товаров...</div>
  }

  if (!safeProducts.length) {
    return (
      <div className={styles.empty}>
        <h3>Товары не найдены</h3>
        <p>Попробуйте изменить поисковый запрос</p>
      </div>
    )
  }

  return (
    <div className={styles.productList}>
      {productItems}
    </div>
  )
})
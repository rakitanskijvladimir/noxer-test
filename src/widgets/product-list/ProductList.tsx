import React, { useMemo } from 'react'
import { Product } from '../../entities/product/types'
import styles from './ProductList.module.scss'

interface ProductListProps {
  products: Product[] | any // Разрешаем any для отладки
  loading?: boolean
}

export const ProductList: React.FC<ProductListProps> = React.memo(({ products, loading = false }) => {
  // Усиленная защита от неправильных данных
  const safeProducts = useMemo(() => {
    console.log('Products in ProductList:', products) // ДЛЯ ОТЛАДКИ
    
    if (Array.isArray(products)) {
      return products
    }
    
    if (products && typeof products === 'object') {
      // Пробуем извлечь массив из различных структур
      if (Array.isArray(products.products)) return products.products
      if (Array.isArray(products.data)) return products.data
      if (Array.isArray(products.items)) return products.items
    }
    
    console.warn('Некорректный формат products:', products)
    return []
  }, [products])

  const productItems = useMemo(() => {
    return safeProducts.map((product: any) => {
      // Защита от неправильной структуры товара
      const safeProduct = {
        id: product.id || Math.random(),
        name: product.name || 'Без названия',
        price: product.price || 0,
        image: product.image || 'https://via.placeholder.com/300x200/007bff/ffffff?text=No+Image',
        description: product.description || 'Описание отсутствует',
        category: product.category || 'Без категории'
      }
      
      return (
        <div key={safeProduct.id} className={styles.productCard}>
          <div className={styles.imageContainer}>
            <img 
              src={safeProduct.image} 
              alt={safeProduct.name}
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
            <h3 className={styles.name}>{safeProduct.name}</h3>
            <p className={styles.description}>{safeProduct.description}</p>
            <div className={styles.footer}>
              <span className={styles.price}>{safeProduct.price.toLocaleString()} ₽</span>
              <button className={styles.cartButton}>В корзину</button>
            </div>
          </div>
        </div>
      )
    })
  }, [safeProducts])

  if (loading) {
    return <div className={styles.loading}>Загрузка товаров...</div>
  }

  if (!safeProducts.length) {
    return (
      <div className={styles.empty}>
        <h3>Товары не найдены</h3>
        <p>Попробуйте изменить поисковый запрос или обновить страницу</p>
      </div>
    )
  }

  return (
    <div className={styles.productList}>
      {productItems}
    </div>
  )
})
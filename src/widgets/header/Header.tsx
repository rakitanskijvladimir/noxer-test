import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.scss'

export const Header: React.FC = React.memo(() => {
  const location = useLocation()

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Noxer Shop
        </Link>
        
        <nav className={styles.nav}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Главная
          </Link>
          <Link 
            to="/catalog" 
            className={`${styles.navLink} ${location.pathname === '/catalog' ? styles.active : ''}`}
          >
            Каталог
          </Link>
          <Link 
            to="/about" 
            className={`${styles.navLink} ${location.pathname === '/about' ? styles.active : ''}`}
          >
            О компании
          </Link>
          <Link 
            to="/contacts" 
            className={`${styles.navLink} ${location.pathname === '/contacts' ? styles.active : ''}`}
          >
            Контакты
          </Link>
        </nav>
      </div>
    </header>
  )
})
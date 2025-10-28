import React from 'react'
import styles from './Footer.module.scss'

export const Footer: React.FC = React.memo(() => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p>&copy; 2024 Noxer Shop. Все права защищены.</p>
          <nav className={styles.nav}>
            <a href="/privacy" className={styles.link}>Политика конфиденциальности</a>
            <a href="/terms" className={styles.link}>Условия использования</a>
          </nav>
        </div>
      </div>
    </footer>
  )
})
import React from 'react'
import styles from './AboutPage.module.scss'

export const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        <h1>О компании</h1>
        <p>Страница находится в разработке</p>
      </div>
    </div>
  )
}
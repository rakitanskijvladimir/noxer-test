import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { Footer } from '../widgets/footer/Footer'
import { MainPage } from '../pages/main/MainPage'
import { CatalogPage } from '../pages/catalog/CatalogPage'
import { AboutPage } from '../pages/about/AboutPage'
import { ContactsPage } from '../pages/contacts/ContactsPage'
// import './styles/global.scss'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <main className="main">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  )
}

export default App
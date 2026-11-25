import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import store from './redux/store'
import ThemeProvider from './components/ThemeProvider/ThemeProvider'

if (typeof window !== 'undefined') {
  ['homies-stay-owner-properties', 'homies-stay-applications', 'homies-stay-rent-payments', 'homies-stay-notification-read'].forEach((key) => window.localStorage.removeItem(key))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider><App /></ThemeProvider>
    </Provider>
  </StrictMode>,
)

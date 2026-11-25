import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppRoutes from './routes/AppRoutes'
import { restoreSession } from './redux/authSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        dispatch(restoreSession())
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [dispatch])

  return (
    <AppRoutes />
  )
}

export default App

import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useRef, useState } from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { NavBar } from './components/NavBar'
import { Context } from './contexts/GlobalContext'
import { check } from './http/userAPI'
import { AppRouter } from './router/AppRouter'

export const App = observer(() => {
  const { user } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const authCheckedRef = useRef(false)

  useEffect(() => {
    if (authCheckedRef.current) return

    authCheckedRef.current = true
    check()
      .then((data) => {
        if (data) {
          user.setUser(data)
          user.setIsAuth(true)
        } else {
          user.setIsAuth(false)
        }
      })
      .finally(() => setLoading(false))
  }, [user.setUser, user.setIsAuth])

  if (loading) {
    return (
      <Spinner
        variant="primary"
        animation="border"
      />
    )
  }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  )
})
export default App

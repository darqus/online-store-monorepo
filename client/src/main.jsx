import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import NotificationProvider from './components/NotificationProvider'
import { Context } from './contexts/GlobalContext'
import { basketStore as basket } from './stores/BasketStore.js'
import { deviceStore as device } from './stores/DeviceStore.js'
import { userStore as user } from './stores/UserStore.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <Context.Provider value={{ user, device, basket }}>
        <App />
      </Context.Provider>
    </NotificationProvider>
  </StrictMode>
)

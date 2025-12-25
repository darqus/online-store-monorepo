import { createContext, useContext } from 'react'

export const Context = createContext(null)

export const useGlobalContext = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider')
  }
  return context
}

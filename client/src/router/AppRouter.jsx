import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Context } from '../contexts/GlobalContext'
import { PUBLIC_ROUTES } from '../utils/consts'
import { authRoutes, publicRoutes } from './routes'

export const AppRouter = () => {
  const { user } = useContext(Context)

  return (
    <Routes>
      {user.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={<Component />}
            exact
          />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={<Component />}
          exact
        />
      ))}
      <Route
        path="*"
        element={<Navigate to={PUBLIC_ROUTES.SHOP.PATH} />}
      />
    </Routes>
  )
}

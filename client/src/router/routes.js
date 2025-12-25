import { Admin } from '../pages/Admin'
import { Auth } from '../pages/Auth'
import { Basket } from '../pages/Basket'
import { BreakpointDemo } from '../pages/BreakpointDemo'
import { Checkout } from '../pages/Checkout'
import { Device } from '../pages/Device'
import { Shop } from '../pages/Shop'
import { AUTH_ROUTES, PUBLIC_ROUTES } from '../utils/consts'
// import AppRouter from './AppRouter'

export const authRoutes = [
  {
    path: AUTH_ROUTES.ADMIN.PATH,
    Component: Admin,
  },
  {
    path: AUTH_ROUTES.BASKET.PATH,
    Component: Basket,
  },
  {
    path: AUTH_ROUTES.CHECKOUT.PATH,
    Component: Checkout,
  },
]

export const publicRoutes = [
  {
    path: PUBLIC_ROUTES.SHOP.PATH,
    Component: Shop,
  },
  {
    path: PUBLIC_ROUTES.LOGIN.PATH,
    Component: Auth,
  },
  {
    path: PUBLIC_ROUTES.REGISTER.PATH,
    Component: Auth,
  },
  {
    path: `${PUBLIC_ROUTES.DEVICE.PATH}/:id`,
    Component: Device,
  },
  {
    path: '/breakpoints',
    Component: BreakpointDemo,
  },
]

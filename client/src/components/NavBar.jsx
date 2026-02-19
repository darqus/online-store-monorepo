import { observer } from 'mobx-react-lite'
import { useCallback, useContext, useMemo } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { NavLink } from 'react-router-dom'
import { Context } from '../contexts/GlobalContext.jsx'
import { getNavMenuItems } from '../utils/consts.js'

export const NavBar = observer(() => {
  const { user, basket } = useContext(Context)

  const logOut = useCallback(() => {
    user.setUser({})
    user.setIsAuth(false)
  }, [user.setUser, user.setIsAuth])

  const NAV_MENU_ITEMS = useMemo(
    () => getNavMenuItems(logOut),
    [logOut]
  )

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
    >
      <Container className="d-flex">
        <Navbar.Brand href="/">Online Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user.isAuth
              ? NAV_MENU_ITEMS.AUTH.map(
                  ({ text, path, className, onClick }) => (
                    <NavLink
                      key={text}
                      to={path}
                      className={({ isActive }) =>
                        `nav-link ${className || ''} ${isActive ? 'active' : ''}`
                      }
                      onClick={onClick}
                    >
                      {text}
                      {text === 'Корзина' && basket.totalQuantity > 0 && (
                        <span className="badge bg-light text-dark ms-2">
                          {basket.totalQuantity}
                        </span>
                      )}
                    </NavLink>
                  )
                )
              : NAV_MENU_ITEMS.NON_AUTH.map(
                  ({ text, path, className, onClick }) => (
                    <NavLink
                      key={text}
                      to={path}
                      className={({ isActive }) =>
                        `nav-link ${className || ''} ${isActive ? 'active' : ''}`
                      }
                      onClick={onClick}
                    >
                      {text}
                    </NavLink>
                  )
                )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
})

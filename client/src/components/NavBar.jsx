import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { Context } from '../contexts/GlobalContext.jsx'
import { getNavMenuItems } from '../utils/consts.js'

export const NavBar = observer(() => {
  const { user, basket } = useContext(Context)

  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false)
  }

  const NAV_MENU_ITEMS = getNavMenuItems(logOut)

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

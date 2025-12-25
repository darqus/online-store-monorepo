import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import { Button, Card, Container, Form, InputGroup } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Context } from '../contexts/GlobalContext'
import { NotificationContext } from '../contexts/NotificationContext'
import { login, registration } from '../http/userAPI'
import { PUBLIC_ROUTES } from '../utils/consts'
import { handleError } from '../utils/errorHandler'

export const Auth = observer(() => {
  const { user } = useContext(Context)
  const { showNotification } = useContext(NotificationContext)
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = location.pathname === PUBLIC_ROUTES.LOGIN.PATH

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validatePassword = (password) => {
    if (password.length < 8)
      return {
        isValid: false,
        message: 'Введите минимум 8 символов',
      }
    if (!/\d/.test(password))
      return {
        isValid: false,
        message: 'Введите минимум 1 цифру',
      }
    if (!/[!^&%]/.test(password))
      return {
        isValid: false,
        message: 'Введите минимум 1 спецсимвол из !^&%',
      }
    return { isValid: true, message: null }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email))
      return {
        isValid: false,
        message: 'Введите корректный email',
      }
    return { isValid: true, message: null }
  }

  const authHandler = async () => {
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.message ?? 'Неизвестная ошибка')
      return
    }
    setEmailError('')
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message ?? 'Неизвестная ошибка')
      return
    }
    setPasswordError('')
    try {
      const authData = isLogin
        ? await login(email, password)
        : await registration(email, password)

      user.setUser(authData)
      user.setIsAuth(true)
      navigate(PUBLIC_ROUTES.SHOP.PATH)
    } catch (error) {
      handleError(showNotification, error)
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Card
        style={{ maxWidth: 450, minWidth: 400 }}
        className="p-5"
      >
        <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
        <Form className="d-flex flex-column gap-4 pt-4">
          <InputGroup hasValidation>
            <Form.Control
              placeholder="Введите email..."
              value={email}
              type="email"
              autoComplete="true"
              required
              isInvalid={!!emailError}
              onChange={({ target: { value } }) => {
                setEmail(value)
                if (emailError) setEmailError('')
              }}
              onBlur={() => {
                const validation = validateEmail(email)
                setEmailError(
                  validation.isValid
                    ? ''
                    : (validation.message ?? 'Неизвестная ошибка')
                )
              }}
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </InputGroup>
          <InputGroup hasValidation>
            <Form.Control
              placeholder="Введите пароль..."
              value={password}
              type="password"
              autoComplete="true"
              required
              isInvalid={!!passwordError}
              onChange={({ target: { value } }) => {
                setPassword(value)
                if (passwordError) setPasswordError('')
              }}
              onBlur={() => {
                const validation = validatePassword(password)
                setPasswordError(
                  validation.isValid
                    ? ''
                    : (validation.message ?? 'Неизвестная ошибка')
                )
              }}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </InputGroup>
          <div className="d-flex gap-3">
            <span className="no-wrap">
              {isLogin ? 'Нет аккаунта' : 'Есть аккаунт?'}
            </span>
            <NavLink
              to={
                isLogin ? PUBLIC_ROUTES.REGISTER.PATH : PUBLIC_ROUTES.LOGIN.PATH
              }
            >
              {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
            </NavLink>
          </div>
          <div>
            <Button
              className="w-100"
              variant={'outline-success'}
              onClick={authHandler}
            >
              {isLogin ? 'Войти' : 'Регистрация'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  )
})

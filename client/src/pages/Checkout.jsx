import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { basketStore } from '../stores/BasketStore'
import { showError, showSuccess, showWarning } from '../utils/notifications'
import { formatPrice } from '../utils/priceFormatter'

export const Checkout = observer(() => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
    comments: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!basketStore.isLoaded && !basketStore.isLoading) {
      basketStore.loadBasket().catch((error) => {
        showError('Ошибка при загрузке корзины', error)
      })
    }
  }, [])

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно для заполнения'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна для заполнения'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Адрес обязателен для заполнения'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Город обязателен для заполнения'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Почтовый индекс обязателен для заполнения'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      if (!validateForm()) {
        return
      }

      if (basketStore.items.length === 0) {
        showWarning('Корзина пуста')
        navigate('/basket')
        return
      }

      setIsSubmitting(true)

      try {
        // Here you would typically send the order to the server
        // For now, we'll just simulate the process
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Clear basket after successful order
        basketStore.clearBasket()

        // Redirect to success page or show success message
        showSuccess('Заказ успешно оформлен!')
        navigate('/shop')
      } catch (error) {
        showError(
          'Произошла ошибка при оформлении заказа. Попробуйте еще раз.',
          error
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [validateForm, navigate]
  )

  const handleBackToBasket = useCallback(() => {
    navigate('/basket')
  }, [navigate])

  if (basketStore.isLoading && basketStore.items.length === 0) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Загрузка...</p>
        </div>
      </Container>
    )
  }

  if (basketStore.items.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="info">
          <Alert.Heading>Корзина пуста</Alert.Heading>
          <p>Добавьте товары в корзину перед оформлением заказа.</p>
          <Button
            variant="outline-success"
            onClick={() => navigate('/shop')}
          >
            Перейти к покупкам
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Оформление заказа</h1>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Информация о доставке</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Имя *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.firstName}
                        placeholder="Введите имя"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Фамилия *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.lastName}
                        placeholder="Введите фамилию"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                        placeholder="example@email.com"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Телефон *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        isInvalid={!!errors.phone}
                        placeholder="+7 (999) 123-45-67"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Адрес доставки *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    isInvalid={!!errors.address}
                    placeholder="Улица, дом, квартира"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Город *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        isInvalid={!!errors.city}
                        placeholder="Город"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Почтовый индекс *</Form.Label>
                      <Form.Control
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        isInvalid={!!errors.postalCode}
                        placeholder="123456"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.postalCode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Комментарий к заказу</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    placeholder="Особые пожелания по доставке или другие комментарии"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Способ оплаты</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  label="Банковская карта"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  label="Наличными при получении"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card
            className="sticky-top"
            style={{ top: '20px' }}
          >
            <Card.Header>
              <h5 className="mb-0">Сводка заказа</h5>
            </Card.Header>
            <Card.Body>
              {basketStore.items.map((item) => (
                <div
                  key={item.deviceId}
                  className="d-flex justify-content-between mb-2"
                >
                  <span
                    className="text-truncate me-2"
                    style={{ fontSize: '14px' }}
                  >
                    {item.device?.name || 'Товар'} × {item.quantity}
                  </span>
                  <span style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                    {formatPrice((item.device?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <strong>Количество товаров:</strong>
                <span>{basketStore.totalQuantity}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <strong>Итого:</strong>
                <span className="h5 text-success mb-0">
                  {formatPrice(basketStore.totalPrice)}
                </span>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Оформление...
                    </>
                  ) : (
                    'Подтвердить заказ'
                  )}
                </Button>

                <Button
                  variant="outline-secondary"
                  onClick={handleBackToBasket}
                  disabled={isSubmitting}
                >
                  Вернуться в корзину
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
})

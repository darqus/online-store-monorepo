import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { basketStore } from '../stores/BasketStore'
import { AUTH_ROUTES } from '../utils/consts'
import { confirm, showError } from '../utils/notifications'
import { pluralizeItem } from '../utils/pluralize'
import { formatPrice } from '../utils/priceFormatter'
import styles from './Basket.module.css'

// Оптимизированный компонент для элемента корзины
const BasketItem = observer(
  ({ item, onRemoveItem, onUpdateQuantity, isSelected, onSelect }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const handleRemove = useCallback(() => {
      onRemoveItem(item.deviceId)
      setShowConfirmModal(false)
    }, [item.deviceId, onRemoveItem])

    const handleShowConfirmModal = useCallback(() => {
      setShowConfirmModal(true)
    }, [])

    const handleCloseConfirmModal = useCallback(() => {
      setShowConfirmModal(false)
    }, [])

    const handleQuantityChange = useCallback(
      async (newQuantity) => {
        const quantity = Number(newQuantity)
        if (quantity > 0) {
          await onUpdateQuantity(item.deviceId, quantity)
        }
      },
      [item.deviceId, onUpdateQuantity]
    )

    const handleIncrement = useCallback(() => {
      handleQuantityChange((Number(item.quantity) || 0) + 1)
    }, [item.quantity, handleQuantityChange])

    const handleDecrement = useCallback(() => {
      const currentQuantity = Number(item.quantity) || 0
      if (currentQuantity > 1) {
        handleQuantityChange(currentQuantity - 1)
      }
    }, [item.quantity, handleQuantityChange])

    // Оптимизированные вычисления для предотвращения лишних перерендеров
    const itemTotal = useMemo(
      () => (Number(item.device?.price) || 0) * (Number(item.quantity) || 0),
      [item.device?.price, item.quantity]
    )

    const imageUrl = useMemo(() => {
      const imgPath = item.device?.img
      if (!imgPath) {
        return ''
      }

      // Добавляем базовый URL если нужно
      if (imgPath.startsWith('http')) return imgPath
      if (imgPath.startsWith('/')) return imgPath

      // Сравниваем с реализацией в DeviceItem.jsx - там используется /static/images/
      return `/static/images/${imgPath}`
    }, [item.device?.img])

    return (
      <Card className={`mb-3 ${styles.basketItem}`}>
        <Card.Body>
          {/* Desktop layout */}
          <div className="d-none d-md-block">
            <Row className="align-items-center">
              <Col
                md={1}
                className="text-center"
              >
                <Form.Check
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => onSelect(item.deviceId, e.target.checked)}
                  aria-label={`Выбрать ${item.device?.name || 'товар'}`}
                />
              </Col>
              <Col md={2}>
                <div className="position-relative d-flex justify-content-center">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={item.device?.name || 'Товар'}
                      fluid
                      className={styles.basketItemImage}
                      style={{
                        objectFit: 'cover',
                        height: '80px',
                        width: '80px',
                        transition: 'opacity 0.3s ease',
                      }}
                      onLoad={(e) => {
                        e.target.style.opacity = '1'
                      }}
                    />
                  )}
                </div>
              </Col>
              <Col md={3}>
                <Card.Title className="h6 mb-2">
                  {item.device?.name || 'Без названия'}
                </Card.Title>
                <Card.Text className="mb-0 text-muted">
                  {formatPrice(Number(item.device?.price) || 0)}
                </Card.Text>
              </Col>
              <Col md={3}>
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className={`${styles.quantityBtn} me-1`}
                    onClick={handleDecrement}
                    disabled={basketStore.isLoading}
                    aria-label="Уменьшить количество"
                  >
                    -
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className={`text-center ${styles.quantityInput}`}
                    style={{ width: '60px' }}
                    disabled={basketStore.isLoading}
                    aria-label="Количество товара"
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className={`${styles.quantityBtn} ms-1`}
                    onClick={handleIncrement}
                    disabled={basketStore.isLoading}
                    aria-label="Увеличить количество"
                  >
                    +
                  </Button>
                </div>
              </Col>
              <Col md={2}>
                <Card.Text className="fw-bold mb-0 h5 text-success">
                  {formatPrice(itemTotal)}
                </Card.Text>
              </Col>
              <Col
                md={1}
                className="d-flex justify-content-end"
              >
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleShowConfirmModal}
                  className={styles.removeBtn}
                  aria-label="Удалить товар"
                >
                  ×
                </Button>
              </Col>
            </Row>
          </div>

          {/* Mobile layout */}
          <div className="d-md-none">
            <Row className="align-items-start">
              <Col xs={3}>
                <div className="position-relative d-flex justify-content-center mb-2">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={item.device?.name || 'Товар'}
                      fluid
                      className={styles.basketItemImage}
                      style={{
                        objectFit: 'cover',
                        height: '70px',
                        width: '70px',
                        transition: 'opacity 0.3s ease',
                        borderRadius: '8px',
                      }}
                      onLoad={(e) => {
                        e.target.style.opacity = '1'
                      }}
                    />
                  )}
                </div>

                {/* Mobile selection checkbox - moved to bottom of image */}
                <div className="d-flex justify-content-center">
                  <Form.Check
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(item.deviceId, e.target.checked)}
                    aria-label={`Выбрать ${item.device?.name || 'товар'}`}
                    style={{ transform: 'scale(1.1)' }}
                  />
                </div>
              </Col>

              <Col xs={9}>
                <Card.Title
                  className="h6 mb-2"
                  style={{ fontSize: '16px', lineHeight: '1.3' }}
                >
                  {item.device?.name || 'Без названия'}
                </Card.Title>

                <Card.Text
                  className="mb-2 text-muted"
                  style={{ fontSize: '14px' }}
                >
                  Цена: {formatPrice(Number(item.device?.price) || 0)}
                </Card.Text>

                {/* Quantity controls - improved mobile layout */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center">
                    <span className="me-2 small text-muted">Кол-во:</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className={`${styles.quantityBtn} me-1`}
                      onClick={handleDecrement}
                      disabled={basketStore.isLoading}
                      style={{
                        minWidth: '36px',
                        height: '36px',
                        padding: '0',
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                      aria-label="Уменьшить количество"
                    >
                      −
                    </Button>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity || 1}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className={`text-center ${styles.quantityInput}`}
                      style={{
                        width: '55px',
                        height: '36px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                      disabled={basketStore.isLoading}
                      aria-label="Количество товара"
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className={`${styles.quantityBtn} ms-1`}
                      onClick={handleIncrement}
                      disabled={basketStore.isLoading}
                      style={{
                        minWidth: '36px',
                        height: '36px',
                        padding: '0',
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                      aria-label="Увеличить количество"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Price and remove button row */}
                <div className="d-flex align-items-center justify-content-between">
                  <Card.Text
                    className="fw-bold mb-0 h6 text-success"
                    style={{ fontSize: '16px' }}
                  >
                    Итого: {formatPrice(itemTotal)}
                  </Card.Text>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleShowConfirmModal}
                    className={`${styles.removeBtn}`}
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      minWidth: 'auto',
                    }}
                    aria-label="Удалить товар"
                  >
                    ✕
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Card.Body>

        {/* Confirmation Modal */}
        <Modal
          show={showConfirmModal}
          onHide={handleCloseConfirmModal}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Подтверждение удаления</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Вы действительно хотите удалить товар "
            {item.device?.name || 'Без названия'}" из корзины?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseConfirmModal}
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              onClick={handleRemove}
            >
              Удалить
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    )
  }
)

export const Basket = observer(() => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState(new Set())

  useEffect(() => {
    // Only load basket if it's completely empty (not loaded and no items)
    if (
      !basketStore.isLoaded &&
      basketStore.items.length === 0 &&
      !basketStore.isLoading
    ) {
      basketStore.loadBasket().catch((error) => {
        showError('Ошибка при загрузке корзины', error)
      })
    }
  }, [])

  // Clear selection when search changes
  useEffect(() => {
    setSelectedItems(new Set())
  }, [])

  // Синхронизируем selectedItems с актуальным состоянием корзины
  useEffect(() => {
    setSelectedItems((prev) => {
      const currentDeviceIds = new Set(
        basketStore.items.map((item) => item.deviceId)
      )
      // Оставляем только те deviceId, которые все еще есть в корзине
      const filteredSet = new Set()
      for (const deviceId of prev) {
        if (currentDeviceIds.has(deviceId)) {
          filteredSet.add(deviceId)
        }
      }
      return filteredSet
    })
  }, [])

  const handleRemoveItem = useCallback(async (deviceId) => {
    await basketStore.removeItem(deviceId)
    // Очищаем выбранный элемент из локального состояния после удаления
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(deviceId)
      return newSet
    })
  }, [])

  const handleUpdateQuantity = useCallback(async (deviceId, quantity) => {
    await basketStore.updateQuantity(deviceId, quantity)
  }, [])

  const handleSelectItem = useCallback((deviceId, isSelected) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (isSelected) {
        newSet.add(deviceId)
      } else {
        newSet.delete(deviceId)
      }
      return newSet
    })
  }, [])

  const handleRemoveSelected = useCallback(async () => {
    if (selectedItems.size === 0) return

    const confirmMessage = `Удалить ${selectedItems.size} выбранн${selectedItems.size === 1 ? 'ый' : 'ых'} ${pluralizeItem(selectedItems.size)} из корзины?`

    const confirmed = await confirm(confirmMessage)
    if (!confirmed) return

    try {
      const promises = Array.from(selectedItems).map((deviceId) =>
        basketStore.removeItem(deviceId)
      )
      await Promise.all(promises)
      setSelectedItems(new Set())
    } catch (error) {
      showError('Ошибка при удалении выбранных товаров', error)
    }
  }, [selectedItems])

  const handleCheckout = useCallback(() => {
    navigate(AUTH_ROUTES.CHECKOUT.PATH)
  }, [navigate])

  const handleClearAllBasket = useCallback(async () => {
    const confirmed = await confirm(
      'Вы действительно хотите очистить всю корзину? Это действие нельзя отменить.'
    )
    if (!confirmed) return

    try {
      await basketStore.clearAllItems()
      setSelectedItems(new Set())
    } catch (error) {
      showError('Ошибка при очистке корзины', error)
    }
  }, [])

  // Фильтрация товаров по поисковому запросу
  const filteredItems = basketStore.items.filter((item) => {
    if (!searchQuery) return true
    const itemName = item.device?.name || ''
    return itemName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleSelectAll = useCallback(
    (isSelected) => {
      if (isSelected) {
        setSelectedItems(new Set(filteredItems.map((item) => item.deviceId)))
      } else {
        setSelectedItems(new Set())
      }
    },
    [filteredItems]
  )

  // Рендер элементов корзины для оптимизации
  const basketItems = filteredItems.map((item) => (
    <BasketItem
      key={item.deviceId} // Используем deviceId как уникальный ключ
      item={item}
      onRemoveItem={handleRemoveItem}
      onUpdateQuantity={handleUpdateQuantity}
      isSelected={selectedItems.has(item.deviceId)}
      onSelect={handleSelectItem}
    />
  ))

  if (basketStore.isLoading && basketStore.items.length === 0) {
    return (
      <Container className="py-4">
        <h1 className="mb-4">Корзина</h1>
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-2">Загрузка корзины...</p>
        </div>
      </Container>
    )
  }

  if (basketStore.items.length === 0) {
    return (
      <Container className="py-4">
        <h1 className="mb-4">Корзина</h1>
        <Card className={`text-center ${styles.emptyStateCard}`}>
          <Card.Body>
            <h5>Ваша корзина пуста</h5>
            <p className="text-muted">Добавьте товары из каталога</p>
            <Button
              variant="outline-success"
              onClick={() => navigate('/shop')}
              size="lg"
              aria-label="Перейти в каталог товаров для добавления товаров в корзину"
            >
              Перейти к покупкам
            </Button>
          </Card.Body>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Корзина</h1>

      {/* Search bar - show only if there are more than 5 items */}
      {basketStore.items.length > 5 && (
        <Card className={`mb-4 ${styles.mobileSearch}`}>
          <Card.Body>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Поиск товаров в корзине..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </Button>
              )}
            </InputGroup>
            {searchQuery && (
              <div className="mt-2 text-muted small">
                Найдено товаров: {filteredItems.length} из{' '}
                {basketStore.items.length}
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Show message if search returned no results */}
      {searchQuery && filteredItems.length === 0 && (
        <Alert
          variant="info"
          className="text-center"
        >
          По запросу "{searchQuery}" ничего не найдено
        </Alert>
      )}

      {/* Bulk actions panel */}
      {filteredItems.length > 0 && (
        <>
          {/* Desktop bulk actions */}
          <Card className="mb-3 d-none d-md-block">
            <Card.Body className="py-2">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    id="selectAll"
                    label={`Выбрать все (${filteredItems.length})`}
                    checked={
                      selectedItems.size === filteredItems.length &&
                      filteredItems.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="me-3"
                  />
                  {selectedItems.size > 0 && (
                    <span className="text-muted">
                      Выбрано: {selectedItems.size}
                    </span>
                  )}
                </div>
                {selectedItems.size > 0 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleRemoveSelected}
                    disabled={basketStore.isLoading}
                  >
                    Удалить выбранные ({selectedItems.size})
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Mobile bulk actions */}
          <div className={`d-md-none mb-3 ${styles.mobileBulkActions}`}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id="selectAllMobile"
                  label={`Все (${filteredItems.length})`}
                  checked={
                    selectedItems.size === filteredItems.length &&
                    filteredItems.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="me-2"
                  aria-label={`Выбрать все ${filteredItems.length} товаров в корзине`}
                />
                {selectedItems.size > 0 && (
                  <span className="text-muted small ms-2 fw-medium">
                    Выбрано: {selectedItems.size}
                  </span>
                )}
              </div>
              {selectedItems.size > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRemoveSelected}
                  disabled={basketStore.isLoading}
                  className="px-3 py-2"
                  aria-label={`Удалить ${selectedItems.size} выбранных товаров`}
                >
                  Удалить
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {basketItems}

      <div className="border-top pt-3 mt-4">
        {/* Desktop summary */}
        <div className="d-none d-md-block">
          <Row className="justify-content-between align-items-center mb-3">
            <Col>
              <strong>Общее количество:</strong>
            </Col>
            <Col className="text-end">
              <span className="fw-bold">{basketStore.totalQuantity}</span>
            </Col>
          </Row>

          <Row className="justify-content-between align-items-center mb-4">
            <Col>
              <strong>Итого:</strong>
            </Col>
            <Col className="text-end">
              <h4 className="text-success mb-0">
                {formatPrice(basketStore.totalPrice)}
              </h4>
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearAllBasket}
              disabled={basketStore.isLoading || basketStore.items.length === 0}
              className="px-3"
            >
              🗑️ Очистить корзину
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={handleCheckout}
              disabled={basketStore.isLoading}
            >
              Оформить заказ
            </Button>
          </div>
        </div>

        {/* Mobile summary */}
        <div className={`d-md-none ${styles.mobileSummary}`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold fs-6">
              Количество: {basketStore.totalQuantity}
            </span>
            <span className="fw-bold text-success h5">
              {formatPrice(basketStore.totalPrice)}
            </span>
          </div>

          <div className="d-grid gap-2">
            <Button
              variant="outline-danger"
              onClick={handleClearAllBasket}
              disabled={basketStore.isLoading || basketStore.items.length === 0}
            >
              🗑️ Очистить корзину
            </Button>
            <Button
              variant="outline-success"
              onClick={handleCheckout}
              disabled={basketStore.isLoading}
              aria-label={`Оформить заказ на сумму ${formatPrice(basketStore.totalPrice)}`}
            >
              Оформить заказ
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
})

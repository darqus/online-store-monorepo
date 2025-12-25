import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Button, ButtonGroup, FormControl } from 'react-bootstrap'
import { useGlobalContext } from '../contexts/GlobalContext'
import { showError } from '../utils/notifications'

export const AddToBasketButton = observer(
  ({ device, className = '', onAdded }) => {
    const { basket } = useGlobalContext()
    const [isLoading, setIsLoading] = useState(false)

    const isInBasket = basket?.items?.some(
      (item) => item.deviceId === device.id
    )
    const basketItem = basket?.items?.find(
      (item) => item.deviceId === device.id
    )

    const handleAddToBasket = async () => {
      if (isLoading) return

      setIsLoading(true)
      try {
        if (isInBasket) {
          // Если товар уже в корзине, увеличиваем количество
          await basket.updateQuantity(device.id, basketItem.quantity + 1)
        } else {
          // Иначе добавляем товар в корзину
          await basket.addItem(device.id, 1)
        }

        if (onAdded) {
          onAdded()
        }
      } catch (error) {
        showError('Ошибка при добавлении товара в корзину', error)
      } finally {
        setIsLoading(false)
      }
    }

    const handleRemoveFromBasket = async () => {
      if (isLoading) return

      setIsLoading(true)
      try {
        await basket?.removeItem(device.id)
      } catch (error) {
        showError('Ошибка при удалении товара из корзины', error)
      } finally {
        setIsLoading(false)
      }
    }

    const handleQuantityChange = async (newQuantity) => {
      const quantity = Number(newQuantity)
      if (isLoading || Number.isNaN(quantity) || quantity <= 0) return

      setIsLoading(true)
      try {
        if (quantity === 0) {
          await basket?.removeItem(device.id)
        } else {
          await basket?.updateQuantity(device.id, quantity)
        }
      } catch (error) {
        showError('Ошибка при изменении количества товара', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isInBasket) {
      return (
        <div className={className}>
          <ButtonGroup>
            <Button
              variant="outline-secondary"
              onClick={() => handleQuantityChange(basketItem.quantity - 1)}
              disabled={isLoading}
            >
              -
            </Button>
            <FormControl
              type="text"
              value={basketItem.quantity}
              readOnly
              style={{ width: '60px', textAlign: 'center' }}
            />
            <Button
              variant="outline-secondary"
              onClick={() => handleQuantityChange(basketItem.quantity + 1)}
              disabled={isLoading}
            >
              +
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveFromBasket}
              disabled={isLoading}
            >
              ×
            </Button>
          </ButtonGroup>
        </div>
      )
    }

    return (
      <Button
        variant="outline-secondary"
        onClick={handleAddToBasket}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? 'Загрузка...' : 'В корзину'}
      </Button>
    )
  }
)

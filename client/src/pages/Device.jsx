import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import { useNavigate, useParams } from 'react-router-dom'
import { AddToBasketButton } from '../components/AddToBasketButton'
import { Rating } from '../components/Rating'
import { Context } from '../contexts/GlobalContext'
import { useDevice } from '../hooks/useDevices'
import { showError } from '../utils/notifications'
import { formatPrice } from '../utils/priceFormatter'

export const Device = observer(() => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { basket, user } = useContext(Context)

  // Используем SWR для загрузки устройства
  const { device: swrDevice, isLoading } = useDevice(id)

  // Загружаем корзину, если пользователь авторизован
  useEffect(() => {
    if (user.isAuth && basket && !basket.isLoaded && !basket.isLoading) {
      basket.loadBasket().catch((error) => {
        showError('Ошибка при загрузке корзины', error)
      })
    }
  }, [user.isAuth, basket?.isLoaded, basket?.isLoading, basket?.loadBasket])

  if (isLoading) return <div>Loading...</div>

  const device = swrDevice || { info: [], name: '', price: 0, rating: 0, imageUrl: '' }

  return (
    <Container className="mt-5">
      <Button
        variant="outline-secondary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        Назад
      </Button>
      <Row>
        <Col
          xs={12}
          sm={6}
          md={6}
        >
          <Image
            width="100%"
            height="auto"
            style={{ objectFit: 'contain' }}
            src={device.imageUrl}
          />
        </Col>
        <Col
          xs={12}
          sm={6}
          md={6}
        >
          <Row className="d-flex flex-column gap-3">
            <div className="display-5">{device?.name}</div>
            <Rating rating={device?.rating}></Rating>
            <div className="h4">Характеристики:</div>
            <Row>
              {device?.info?.map(({ id, title, description }) => (
                <div key={id}>
                  {title}: {description}
                </div>
              ))}
            </Row>
            <div className="h1 mb-0">{formatPrice(device?.price)}</div>
            <div className="d-flex flex-column">
              <AddToBasketButton device={device} />
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  )
})

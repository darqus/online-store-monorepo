import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import { useNavigate } from 'react-router-dom'
import { PUBLIC_ROUTES } from '../utils/consts'
import { formatPrice } from '../utils/priceFormatter'
import { AddToBasketButton } from './AddToBasketButton'
import { Rating } from './Rating'

export const DeviceItem = ({ device }) => {
  const navigate = useNavigate()

  return (
    <Col
      xs={12}
      sm={6}
      md={6}
      lg={4}
      xl={3}
      className="mb-3"
      onClick={(e) => {
        // Проверяем, был ли клик по кнопке "В корзину" или другим элементам управления
        if (!e.target.closest('button, .btn')) {
          navigate(`${PUBLIC_ROUTES.DEVICE.PATH}/${device.id}`)
        }
      }}
    >
      <Card style={{ cursor: 'pointer', minHeight: '400px' }}>
        <Card.Body className="d-flex flex-column gap-2">
          <Card.Img
            width="auto"
            height="200px"
            style={{ objectFit: 'contain' }}
            src={`/static/images/${device.img}`}
          />
          <div className="text-truncate lead mt-3">{device.name}</div>
          <div className="text-truncate">{device.brand?.name}</div>
          <div className="text-truncate text-secondary">
            {device.brand?.country}
          </div>
          <div className="text-truncate h3 mb-0">
            {formatPrice(device.price)}
          </div>
          <Rating rating={device.rating}></Rating>
          <div className="text-truncate">{device.description}</div>
          <AddToBasketButton
            device={device}
            className="mt-auto"
          />
        </Card.Body>
      </Card>
    </Col>
  )
}

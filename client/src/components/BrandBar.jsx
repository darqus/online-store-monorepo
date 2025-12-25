import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { Card } from 'react-bootstrap'
import { Context } from '../contexts/GlobalContext'

export const BrandBar = observer(() => {
  const { device } = useContext(Context)

  return (
    <div>
      {Array.isArray(device.brands) && device.brands.length > 0 && (
        <Card
          className="mb-4"
          style={{ cursor: 'pointer' }}
          border={!device.selectedBrand ? 'info' : ''}
          onClick={() => device.setSelectedBrand(null)}
        >
          <Card.Body>
            <Card.Title>Все бренды</Card.Title>
            <Card.Text className="text-secondary">Показать всё</Card.Text>
          </Card.Body>
        </Card>
      )}
      {Array.isArray(device.brands) &&
        device.brands.map((brand) => (
          <Card
            key={brand.id}
            className="mb-4"
            style={{ cursor: 'pointer' }}
            border={
              device.selectedBrand && brand.id === device.selectedBrand.id
                ? 'info'
                : ''
            }
            onClick={() => device.setSelectedBrand(brand)}
          >
            <Card.Body>
              <Card.Title>{brand.name}</Card.Title>
              <Card.Text className="text-secondary">{brand.country}</Card.Text>
            </Card.Body>
          </Card>
        ))}
    </div>
  )
})

import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { Context } from '../contexts/GlobalContext'

export const TypeBar = observer(() => {
  const { device } = useContext(Context)

  return (
    <ListGroup>
      <ListGroup.Item
        style={{ cursor: 'pointer' }}
        active={!device.selectedType}
        onClick={() => device.setSelectedType(null)}
        variant="light"
      >
        Все типы
      </ListGroup.Item>
      {Array.isArray(device.types) &&
        device.types.map((type) => (
          <ListGroup.Item
            key={type.id}
            style={{ cursor: 'pointer' }}
            active={device.selectedType && type.id === device.selectedType.id}
            onClick={() => device.setSelectedType(type)}
            variant="light"
          >
            {type.name}
          </ListGroup.Item>
        ))}
    </ListGroup>
  )
})

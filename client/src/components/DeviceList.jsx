import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Context } from '../contexts/GlobalContext'
import { DeviceItem } from './DeviceItem'

export const DeviceList = observer(() => {
  const { device } = useContext(Context)

  if (!device.devices || device.devices.length === 0) {
    return (
      <Row
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        <Col className="text-center">
          <div className="text-muted">Устройства не найдены</div>
        </Col>
      </Row>
    )
  }

  return (
    <Row className="d-flex align-items-stretch">
      {device.devices.map((deviceItem) => (
        <DeviceItem
          key={deviceItem.id}
          device={deviceItem}
        />
      ))}
    </Row>
  )
})

import { Suspense, lazy, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import { getAdminMenu } from '../utils/consts'

// Ленивая загрузка модальных окон
const CreateTypeModal = lazy(() => import('../components/modals/CreateTypeModal'))
const CreateBrandModal = lazy(() => import('../components/modals/CreateBrandModal'))
const CreateDeviceModal = lazy(() => import('../components/modals/CreateDeviceModal'))

const ModalFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1050 }}>
    <Spinner variant="primary" animation="border" />
  </div>
)

export const Admin = () => {
  const [brandVisible, setBrandVisible] = useState(false)
  const [typeVisible, setTypeVisible] = useState(false)
  const [deviceVisible, setDeviceVisible] = useState(false)

  const ADMIN_MENU = getAdminMenu(
    setTypeVisible,
    setBrandVisible,
    setDeviceVisible
  )

  return (
    <Container>
      <div className="d-flex gap-3 mt-4">
        {ADMIN_MENU.map(({ id, variant, label, onClick }) => (
          <div key={id}>
            <Button
              variant={variant}
              onClick={onClick}
            >
              {label}
            </Button>
          </div>
        ))}
      </div>
      <Suspense fallback={<ModalFallback />}>
        {typeVisible && (
          <CreateTypeModal
            show={typeVisible}
            handleClose={() => setTypeVisible(false)}
          />
        )}
        {brandVisible && (
          <CreateBrandModal
            show={brandVisible}
            handleClose={() => setBrandVisible(false)}
          />
        )}
        {deviceVisible && (
          <CreateDeviceModal
            show={deviceVisible}
            handleClose={() => setDeviceVisible(false)}
          />
        )}
      </Suspense>
    </Container>
  )
}

import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { CreateBrandModal } from '../components/modals/CreateBrandModal'
import { CreateDeviceModal } from '../components/modals/CreateDeviceModal'
import { CreateTypeModal } from '../components/modals/CreateTypeModal'
import { getAdminMenu } from '../utils/consts'

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
      <CreateTypeModal
        show={typeVisible}
        handleClose={() => setTypeVisible(false)}
      />
      <CreateBrandModal
        show={brandVisible}
        handleClose={() => setBrandVisible(false)}
      />
      <CreateDeviceModal
        show={deviceVisible}
        handleClose={() => setDeviceVisible(false)}
      />
    </Container>
  )
}

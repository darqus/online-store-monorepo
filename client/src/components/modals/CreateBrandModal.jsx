import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { createBrand } from '../../http/deviceAPI'
import { FORM_CONTROLS } from '../../utils/consts'

export const CreateBrandModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({ name: '', country: '' })

  const addBrand = () => {
    createBrand(formData).then(() => {
      setFormData({ name: '', country: '' })
      handleClose()
    })
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Добавить бренд</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="d-flex flex-column gap-3">
          {FORM_CONTROLS.BRAND.map(({ id, type, placeholder }) => (
            <Form.Control
              key={id}
              name={id}
              type={type}
              placeholder={placeholder}
              value={formData[id] ?? ''}
              onChange={({ target: { name, value } }) =>
                setFormData((prev) => ({ ...prev, [name]: value }))
              }
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-danger"
          onClick={handleClose}
        >
          Закрыть
        </Button>
        <Button
          variant="outline-success"
          onClick={addBrand}
        >
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

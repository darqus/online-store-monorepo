import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import { createType } from '../../http/deviceAPI'
import { FORM_CONTROLS } from '../../utils/consts'

export const CreateTypeModal = ({ show, handleClose }) => {
  const [value, setValue] = useState('')

  const addType = () => {
    createType({ name: value }).then(() => {
      setValue('')
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
        <Modal.Title>Добавить тип</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {FORM_CONTROLS.TYPE.map(({ id, type, placeholder }) => (
            <Form.Control
              key={id}
              name={id}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={({ target: { value } }) => setValue(value)}
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
          onClick={addType}
        >
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

import { observer } from 'mobx-react-lite'
import { Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

/**
 * Компонент диалога подтверждения для замены window.confirm
 * @param {Object} confirmation - Объект подтверждения из store
 * @param {Function} onConfirm - Функция подтверждения
 * @param {Function} onCancel - Функция отмены
 */
const ConfirmationDialog = observer(({ confirmation, onConfirm, onCancel }) => {
  if (!confirmation) return null

  const handleConfirm = () => {
    onConfirm(confirmation.id, true)
  }

  const handleCancel = () => {
    onCancel(confirmation.id)
  }

  return (
    <Modal
      show={true}
      onHide={handleCancel}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{confirmation.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{confirmation.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleCancel}
        >
          Отмена
        </Button>
        <Button
          variant="outline-success"
          onClick={handleConfirm}
        >
          Подтвердить
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

export default ConfirmationDialog

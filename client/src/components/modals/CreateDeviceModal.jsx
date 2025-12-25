import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { Button, Dropdown, Form, Modal } from 'react-bootstrap'
import { Context } from '../../contexts/GlobalContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import { createDevice, fetchBrands, fetchTypes } from '../../http/deviceAPI'
import { DEVICE_FORM_CONTROLS } from '../../utils/consts'
import { showError } from '../../utils/notifications'

export const CreateDeviceModal = observer(({ show, handleClose }) => {
  const { device } = useContext(Context)
  const { showNotification } = useContext(NotificationContext)

  // Инициализация состояния формы
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [file, setFile] = useState([])
  const [info, setInfo] = useState([])

  // Объект с текущими значениями полей формы
  const formValues = { name, price, file }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [typesData, brandsData] = await Promise.all([
          fetchTypes(),
          fetchBrands(),
        ])

        device.setTypes(typesData)
        device.setBrands(brandsData)
      } catch (error) {
        showError('Ошибка при загрузке данных для создания товара', error)
      }
    }

    loadData()
  }, [device])

  const addInfo = () => {
    setInfo((info) => [
      ...info,
      {
        title: '',
        description: '',
        number: Date.now(),
      },
    ])
  }

  const addDevice = () => {
    /* console.log('addDevice called with data:', {
      name,
      price,
      file,
      selectedType: device.selectedType,
      selectedBrand: device.selectedBrand,
      info,
    }) */
    if (!name.trim()) {
      showNotification('Введите название устройства')
      return
    }
    if (price <= 0) {
      showNotification('Введите корректную стоимость устройства')
      return
    }
    if (!file) {
      showNotification('Выберите изображение устройства')
      return
    }
    if (!device.selectedType) {
      showNotification('Выберите тип устройства')
      return
    }
    if (!device.selectedBrand) {
      showNotification('Выберите бренд устройства')
      return
    }
    const { selectedType, selectedBrand } = device
    const deviceData = {
      name,
      price: `${price}`,
      img: file,
      typeId: selectedType?.id ?? '',
      brandId: selectedBrand?.id ?? '',
      info: JSON.stringify(info),
    }
    const formData = new FormData()
    Object.entries(deviceData).forEach(([key, value]) => {
      formData.append(key, value)
    })
    createDevice(formData)
      .then(() => {
        console.log('Device created successfully')
        showNotification('Устройство добавлено успешно')
        handleClose()
      })
      .catch((error) => {
        showError('Ошибка при добавлении устройства', error)
      })
  }

  const changeInfo = (event, key, number) => {
    const { value } = event.target
    setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)))
  }

  const removeInfo = (number) => {
    setInfo(info.filter((item) => item.number !== number))
  }

  const setters = {
    name: setName,
    price: setPrice,
    file: ([file]) => setFile(file),
  }

  const onChangeHandler = (event, type) => {
    const { value, files } = event.target
    const setter = setters[type]
    if (setter) {
      setter(type === 'price' ? Number(value) : type === 'file' ? files : value)
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Добавить устройство</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="d-flex gap-3 mb-3">
            <Dropdown>
              <Dropdown.Toggle variant="light">
                {device.selectedType?.name ?? 'Выберите тип'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {device.types.map((type) => (
                  <Dropdown.Item
                    onClick={() => device.setSelectedType(type)}
                    key={type.id}
                  >
                    {type.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle variant="light">
                {device.selectedBrand?.name ?? 'Выберите бренд'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {device.brands.map((brand) => (
                  <Dropdown.Item
                    onClick={() => device.setSelectedBrand(brand)}
                    key={brand.id}
                  >
                    {brand.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="d-flex flex-column gap-3 pb-3">
            {DEVICE_FORM_CONTROLS.map(({ id, type, placeholder, accept }) => (
              <Form.Control
                key={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={type !== 'file' ? formValues[id] : undefined}
                onChange={(e) => onChangeHandler(e, id)}
                accept={accept}
              />
            ))}
          </div>
          <Button
            variant="outline-success"
            onClick={addInfo}
            className="mb-2"
          >
            Добавить новое свойство
          </Button>
          {info.map(({ number, title, description }) => (
            <div
              key={number}
              className="d-flex gap-3 py-2"
            >
              <div>
                <Form.Control
                  placeholder="Название характеристики"
                  value={title}
                  onChange={(event) => changeInfo(event, 'title', number)}
                />
              </div>
              <div>
                <Form.Control
                  placeholder="Описание характеристики"
                  value={description}
                  onChange={(event) => changeInfo(event, 'description', number)}
                />
              </div>
              <div>
                <Button
                  variant="outline-danger"
                  onClick={() => removeInfo(number)}
                >
                  Удалить
                </Button>
              </div>
            </div>
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
          onClick={addDevice}
        >
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  )
})

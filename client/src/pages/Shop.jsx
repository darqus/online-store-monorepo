import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { BrandBar } from '../components/BrandBar'
import { DeviceList } from '../components/DeviceList'
import { PagePagination } from '../components/PagePagination'
import { TypeBar } from '../components/TypeBar'
import { Context } from '../contexts/GlobalContext'
import { fetchBrands, fetchTypes } from '../http/deviceAPI'
import { showError } from '../utils/notifications'

export const Shop = observer(() => {
  const { device, basket, user } = useContext(Context)

  // Загрузка типов и брендов при монтировании
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [typesData, brandsData] = await Promise.all([
          fetchTypes(),
          fetchBrands(),
        ])
        device.setTypes(typesData)
        device.setBrands(brandsData)
      } catch (error) {
        showError('Ошибка при загрузке данных магазина', error)
      }
    }

    loadInitialData()
  }, [device.setTypes, device.setBrands])

  // Загружаем корзину, если пользователь авторизован
  useEffect(() => {
    if (user.isAuth && basket && !basket.isLoaded && !basket.isLoading) {
      basket.loadBasket().catch((error) => {
        showError('Ошибка при загрузке корзины', error)
      })
    }
  }, [user.isAuth, basket?.isLoaded, basket?.isLoading, basket?.loadBasket])

  // Загрузка устройств при изменении фильтров и пагинации
  useEffect(() => {
    const typeId = device.selectedType?.id
    const brandId = device.selectedBrand?.id
    const { currentPage, limit } = device.pagination

    device
      .fetchDevices(typeId, brandId, currentPage, limit)
      .catch((error) => showError('Ошибка при загрузке товаров', error))
  }, [
    device.selectedType?.id,
    device.selectedBrand?.id,
    device.pagination.currentPage,
    device.pagination.limit,
  ])

  return (
    <Container className="mt-4">
      <Row>
        <Col
          xs={12}
          sm={4}
          md={3}
          style={{
            maxHeight: '85vh',
            overflowY: 'auto',
            paddingRight: '15px',
          }}
        >
          <TypeBar />
          <br />
          <BrandBar />
        </Col>
        <Col
          xs={12}
          sm={8}
          md={9}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '90vh',
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '15px',
            }}
          >
            <DeviceList />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <PagePagination />
          </div>
        </Col>
      </Row>
    </Container>
  )
})

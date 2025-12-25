import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap'
import {
  Desktop,
  Hidden,
  Mobile,
  Responsive,
  ResponsiveGrid,
  Tablet,
  Visible,
} from '../components/Breakpoint.jsx'
import {
  useBreakpoint,
  useMediaQuery,
  useResponsiveCondition,
  useResponsiveValue,
} from '../hooks/useBreakpoint.js'
import {
  getResponsiveClass,
  getResponsiveSpacingClass,
} from '../utils/breakpoints.js'

export const BreakpointDemo = () => {
  const {
    currentBreakpoint,
    windowWidth,
    isMobile,
    isTablet,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
  } = useBreakpoint()

  // Пример использования useResponsiveValue
  const responsiveText = useResponsiveValue({
    xs: 'Extra Small Screen',
    sm: 'Small Screen',
    md: 'Medium Screen',
    lg: 'Large Screen',
    xl: 'Extra Large Screen',
    xxl: 'Extra Extra Large Screen',
  })

  // Пример использования useResponsiveCondition
  const shouldShowAlert = useResponsiveCondition({
    xs: true,
    sm: false,
    md: false,
    lg: true,
    xl: true,
    xxl: false,
  })

  // Пример использования useMediaQuery
  const isPortrait = useMediaQuery('(orientation: portrait)')

  // Данные для демонстрации сетки
  const gridItems = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <Container
      fluid
      className="py-4"
    >
      <h1 className="text-center mb-4">React Bootstrap Breakpoints Demo</h1>

      {/* Информация о текущем брейкпоинте */}
      <Alert
        variant="info"
        className="mb-4"
      >
        <h5>Current Breakpoint Information</h5>
        <p>
          <strong>Breakpoint:</strong> {currentBreakpoint}
        </p>
        <p>
          <strong>Window Width:</strong> {windowWidth}px
        </p>
        <p>
          <strong>Device Type:</strong>{' '}
          {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
        </p>
        <p>
          <strong>Specific Breakpoints:</strong>
          XS: {isXs ? '✓' : '✗'} | SM: {isSm ? '✓' : '✗'} | MD:{' '}
          {isMd ? '✓' : '✗'} | LG: {isLg ? '✓' : '✗'} | XL: {isXl ? '✓' : '✗'} |
          XXL: {isXxl ? '✓' : '✗'}
        </p>
        <p>
          <strong>Orientation:</strong> {isPortrait ? 'Portrait' : 'Landscape'}
        </p>
      </Alert>

      {/* Responsive текст */}
      <Card className="mb-4">
        <Card.Header>useResponsiveValue Hook</Card.Header>
        <Card.Body>
          <h4 className="text-center">{responsiveText}</h4>
          <p className="text-muted">
            This text changes based on the current breakpoint
          </p>
        </Card.Body>
      </Card>

      {/* Conditional Alert */}
      {shouldShowAlert && (
        <Alert
          variant="warning"
          className="mb-4"
        >
          This alert is only visible on XS, LG, and XL breakpoints!
        </Alert>
      )}

      {/* Примеры использования компонентов */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Header>Mobile Only</Card.Header>
            <Card.Body>
              <Mobile>
                <Alert variant="success">
                  📱 This content is only visible on mobile devices (below MD)
                </Alert>
              </Mobile>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>Tablet Only</Card.Header>
            <Card.Body>
              <Tablet>
                <Alert variant="info">
                  📱 This content is only visible on tablets (SM to LG)
                </Alert>
              </Tablet>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>Desktop Only</Card.Header>
            <Card.Body>
              <Desktop>
                <Alert variant="primary">
                  🖥️ This content is only visible on desktop (LG and above)
                </Alert>
              </Desktop>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Примеры Visible/Hidden */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Visible Above MD</Card.Header>
            <Card.Body>
              <Visible above="md">
                <Alert variant="success">✅ Visible on MD and above</Alert>
              </Visible>
              <Hidden above="md">
                <Alert variant="danger">
                  ❌ Hidden on MD and above (visible below)
                </Alert>
              </Hidden>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Visible Below LG</Card.Header>
            <Card.Body>
              <Visible below="lg">
                <Alert variant="warning">⚠️ Visible below LG</Alert>
              </Visible>
              <Hidden below="lg">
                <Alert variant="info">
                  ℹ️ Hidden below LG (visible on LG and above)
                </Alert>
              </Hidden>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Responsive Grid */}
      <Card className="mb-4">
        <Card.Header>Responsive Grid System</Card.Header>
        <Card.Body>
          <p className="text-muted">Grid columns change based on breakpoint:</p>
          <ResponsiveGrid
            cols={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}
            gap={3}
          >
            {gridItems.map((item) => (
              <div
                key={item}
                className="bg-primary text-white d-flex align-items-center justify-content-center rounded"
                style={{ height: '60px' }}
              >
                {item}
              </div>
            ))}
          </ResponsiveGrid>
        </Card.Body>
      </Card>

      {/* Bootstrap Grid с брейкпоинтами */}
      <Card className="mb-4">
        <Card.Header>Bootstrap Grid with Breakpoints</Card.Header>
        <Card.Body>
          <Row>
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <div className="bg-light p-3 border text-center">
                <strong>Col XS-12 SM-6 MD-4 LG-3</strong>
                <br />
                <small>Responsive column</small>
              </div>
            </Col>
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <div className="bg-light p-3 border text-center">
                <strong>Col XS-12 SM-6 MD-4 LG-3</strong>
                <br />
                <small>Responsive column</small>
              </div>
            </Col>
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <div className="bg-light p-3 border text-center">
                <strong>Col XS-12 SM-6 MD-4 LG-3</strong>
                <br />
                <small>Responsive column</small>
              </div>
            </Col>
            <Col
              xs={12}
              sm={6}
              md={12}
              lg={3}
            >
              <div className="bg-light p-3 border text-center">
                <strong>Col XS-12 SM-6 MD-12 LG-3</strong>
                <br />
                <small>Responsive column</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Responsive Component с функцией */}
      <Card className="mb-4">
        <Card.Header>Responsive Component with Function</Card.Header>
        <Card.Body>
          <Responsive>
            {(breakpoint) => (
              <Alert variant="secondary">
                <h5>Function-based Responsive Content</h5>
                <p>
                  Current breakpoint: <strong>{breakpoint}</strong>
                </p>
                <p>
                  This content is rendered using a function that receives the
                  current breakpoint as a parameter.
                </p>
              </Alert>
            )}
          </Responsive>
        </Card.Body>
      </Card>

      {/* Responsive Component с объектом */}
      <Card className="mb-4">
        <Card.Header>Responsive Component with Object</Card.Header>
        <Card.Body>
          <Responsive
            xs={<Alert variant="danger">XS Content</Alert>}
            sm={<Alert variant="warning">SM Content</Alert>}
            md={<Alert variant="info">MD Content</Alert>}
            lg={<Alert variant="primary">LG Content</Alert>}
            xl={<Alert variant="success">XL Content</Alert>}
            xxl={<Alert variant="dark">XXL Content</Alert>}
          />
        </Card.Body>
      </Card>

      {/* Utility Classes */}
      <Card className="mb-4">
        <Card.Header>Utility Classes Examples</Card.Header>
        <Card.Body>
          <div className={`mb-3 ${getResponsiveClass('flex', 'md')}`}>
            <Alert variant="info">
              This uses <code>getResponsiveClass('flex', 'md')</code> - display:
              flex on MD and above
            </Alert>
          </div>

          <div className={getResponsiveSpacingClass('margin', 3, 'lg')}>
            <Alert variant="secondary">
              This uses{' '}
              <code>getResponsiveSpacingClass('margin', 3, 'lg')</code> -
              margin: 3 on LG and above
            </Alert>
          </div>
        </Card.Body>
      </Card>

      {/* Кнопки для тестирования */}
      <Card>
        <Card.Header>Interactive Examples</Card.Header>
        <Card.Body>
          <Row>
            <Col
              xs={12}
              sm={6}
              md={3}
              className="mb-3"
            >
              <Button
                variant="primary"
                className="w-100"
                size={useResponsiveValue({ xs: 'sm', md: 'lg' })}
              >
                Responsive Button Size
              </Button>
            </Col>
            <Col
              xs={12}
              sm={6}
              md={3}
              className="mb-3"
            >
              <Button
                variant="success"
                className="w-100"
                disabled={useResponsiveCondition({ xs: true, sm: false })}
              >
                Disabled on Mobile Only
              </Button>
            </Col>
            <Col
              xs={12}
              sm={6}
              md={3}
              className="mb-3"
            >
              <Button
                variant="warning"
                className="w-100"
              >
                {isMobile ? '📱 Mobile' : '🖥️ Desktop'}
              </Button>
            </Col>
            <Col
              xs={12}
              sm={6}
              md={3}
              className="mb-3"
            >
              <Button
                variant="info"
                className="w-100"
              >
                {windowWidth}px
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

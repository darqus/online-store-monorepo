# React Bootstrap Breakpoints Documentation

Эта документация описывает использование системы брейкпоинтов, основанной на официальной документации React Bootstrap: <https://react-bootstrap.netlify.app/docs/layout/breakpoints>

## Обзор

Система брейкпоинтов предоставляет инструменты для создания адаптивных интерфейсов с использованием стандартных брейкпоинтов Bootstrap 5:

- **xs**: 0px и выше (мобильные устройства)
- **sm**: 576px и выше (малые планшеты)
- **md**: 768px и выше (планшеты)
- **lg**: 992px и выше (маленькие десктопы)
- **xl**: 1200px и выше (десктопы)
- **xxl**: 1400px и выше (большие десктопы)

## Файлы системы

### 1. `src/utils/breakpoints.js`

Основные константы и утилиты для работы с брейкпоинтами.

```javascript
import {
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  getCurrentBreakpoint,
  getResponsiveClass,
  getResponsiveSpacingClass
} from '../utils/breakpoints.js'
```

### 2. `src/hooks/useBreakpoint.js`

React хуки для работы с брейкпоинтами.

```javascript
import {
  useBreakpoint,
  useResponsiveValue,
  useResponsiveCondition,
  useMediaQuery
} from '../hooks/useBreakpoint.js'
```

### 3. `src/components/Breakpoint.jsx`

Компоненты для условного рендеринга на основе брейкпоинтов.

```javascript
import {
  Breakpoint,
  Responsive,
  ResponsiveGrid,
  Mobile,
  Tablet,
  Desktop,
  Visible,
  Hidden
} from '../components/Breakpoint.jsx'
```

## Использование хуков

### useBreakpoint

Основной хук для получения информации о текущем брейкпоинте.

```javascript
const {
  currentBreakpoint,     // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  windowWidth,           // текущая ширина окна в px
  isMobile,              // true для xs, sm
  isTablet,              // true для md, lg
  isDesktop,             // true для lg, xl, xxl
  isXs, isSm, isMd, isLg, isXl, isXxl, // проверки конкретных брейкпоинтов
  isMin,                 // функция: isMin('md') -> true для md, lg, xl, xxl
  isMax,                 // функция: isMax('lg') -> true для xs, sm, md, lg
  isBetween              // функция: isBetween('sm', 'lg') -> true для sm, md, lg
} = useBreakpoint()
```

### useResponsiveValue

Получение значения в зависимости от текущего брейкпоинта.

```javascript
const buttonText = useResponsiveValue({
  xs: 'Нажми',
  sm: 'Нажми сюда',
  md: 'Нажми на кнопку',
  lg: 'Нажми на эту кнопку',
  xl: 'Пожалуйста, нажми на эту кнопку'
})

const cols = useResponsiveValue({
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4
})
```

### useResponsiveCondition

Получение булевого значения в зависимости от брейкпоинта.

```javascript
const shouldShowSidebar = useResponsiveCondition({
  xs: false,
  sm: false,
  md: true,
  lg: true,
  xl: true
})
```

### useMediaQuery

Работа с произвольными media queries.

```javascript
const isPortrait = useMediaQuery('(orientation: portrait)')
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
const isPrint = useMediaQuery('print')
```

## Использование компонентов

### Breakpoint

Компонент для условного рендеринга с гибкими настройками.

```javascript
<Breakpoint above="md">
  {/* Видимо на md, lg, xl, xxl */}
</Breakpoint>

<Breakpoint below="lg">
  {/* Видимо на xs, sm, md, lg */}
</Breakpoint>

<Breakpoint only="sm">
  {/* Видимо только на sm */}
</Breakpoint>

<Breakpoint hide="xs">
  {/* Скрыто на xs и выше */}
</Breakpoint>
```

### Удобные компоненты

```javascript
<Mobile>
  {/* Видимо только на мобильных (xs, sm) */}
</Mobile>

<Tablet>
  {/* Видимо только на планшетах (md, lg) */}
</Tablet>

<Desktop>
  {/* Видимо только на десктопах (lg, xl, xxl) */}
</Desktop>

<Visible above="md">
  {/* Видимо на md и выше */}
</Visible>

<Hidden below="lg">
  {/* Скрыто ниже lg */}
</Hidden>
```

### Responsive

Компонент для рендеринга разного контента для разных брейкпоинтов.

```javascript
// С функцией
<Responsive>
  {(breakpoint) => (
    <div>Текущий брейкпоинт: {breakpoint}</div>
  )}
</Responsive>

// С объектом
<Responsive
  xs={<MobileComponent />}
  sm={<SmallTabletComponent />}
  md={<TabletComponent />}
  lg={<DesktopComponent />}
/>
```

### ResponsiveGrid

Адаптивная сетка с настраиваемым количеством колонок.

```javascript
<ResponsiveGrid
  cols={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  gap={3}
>
  {items.map({id, content} => (
    <div key={id}>{content}</div>
  ))}
</ResponsiveGrid>
```

## Утилиты

### getResponsiveClass

Генерация CSS классов для display свойств.

```javascript
const className = getResponsiveClass('flex', 'md')
// 'd-flex-md'

const className = getResponsiveClass('none')
// 'd-none'
```

### getResponsiveSpacingClass

Генерация CSS классов для отступов.

```javascript
const className = getResponsiveSpacingClass('margin', 3, 'lg')
// 'm-3-lg'

const className = getResponsiveSpacingClass('top', 2, 'sm')
// 'mt-2-sm'
```

## Интеграция с React Bootstrap

### Колонки сетки

```javascript
<Row>
  <Col xs={12} sm={6} md={4} lg={3}>
    {/* Адаптивная колонка */}
  </Col>
</Row>
```

### Скрытие/показ элементов

```javascript
<div className="d-none d-md-block">
  {/* Скрыто на xs, sm, видно на md и выше */}
</div>

<div className="d-block d-lg-none">
  {/* Видимо на xs, sm, md, скрыто на lg и выше */}
</div>
```

## Примеры использования

### Адаптивная навигация

```javascript
const Navigation = () => {
  const { isMobile } = useBreakpoint()

  return (
    <Navbar>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </Navbar>
  )
}
```

### Адаптивная карточка

```javascript
const ProductCard = ({ product }) => {
  const imageSize = useResponsiveValue({
    xs: 'small',
    sm: 'medium',
    lg: 'large'
  })

  return (
    <Card>
      <Card.Img variant="top" src={product.image} size={imageSize} />
      <Card.Body>
        <Card.Title>{product.title}</Card.Title>
      </Card.Body>
    </Card>
  )
}
```

### Условный рендеринг

```javascript
const Sidebar = () => {
  const shouldShow = useResponsiveCondition({
    xs: false,
    sm: false,
    md: true
  })

  return shouldShow ? <SidebarContent /> : null
}
```

## Демонстрация

Посмотреть все примеры в действии можно на странице `/breakpoints`.

## Лучшие практики

1. **Mobile-first подход**: Начинайте с мобильной версии и добавляйте сложности для больших экранов
2. **Используйте хуки**: Предпочитайте хуки компонентам для простой логики
3. **Компоненты для сложных случаев**: Используйте компоненты Breakpoint/Responsive для сложных условий
4. **Тестируйте**: Проверяйте адаптивность на разных размерах экрана
5. **Производительность**: Используйте `useMemo` для сложных вычислений в хуках

## Совместимость

Система полностью совместима с:

- React Bootstrap 2.x
- Bootstrap 5.x
- Современными браузерами
- Server-side rendering (с проверками на typeof window)

## Дополнительные ресурсы

- [React Bootstrap Layout Documentation](https://react-bootstrap.netlify.app/docs/layout/)
- [Bootstrap Breakpoints Documentation](https://getbootstrap.com/docs/5.3/layout/breakpoints/)
- [MDN Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)

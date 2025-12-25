import React from 'react'
import { useBreakpoint, useResponsiveValue } from '../hooks/useBreakpoint.js'

/**
 * Component for conditional rendering based on breakpoints
 * Similar to React Bootstrap's display utilities but more flexible
 */
export const Breakpoint = ({
  children,
  above,
  below,
  only,
  hide,
  fallback = null,
}) => {
  const { isMin, isMax, currentBreakpoint } = useBreakpoint()

  // Check if should render based on conditions
  const shouldRender = React.useMemo(() => {
    if (above && !isMin(above)) return false
    if (below && !isMax(below)) return false
    if (only && currentBreakpoint !== only) return false
    if (hide && isMin(hide)) return false
    return true
  }, [above, below, only, hide, isMin, isMax, currentBreakpoint])

  return shouldRender ? children : fallback
}

/**
 * Component for responsive rendering with different content per breakpoint
 */
export const Responsive = ({ children }) => {
  const { currentBreakpoint } = useBreakpoint()

  // If children is a function, call it with current breakpoint
  if (typeof children === 'function') {
    return children(currentBreakpoint)
  }

  // If children is an object with breakpoint keys, return appropriate content
  if (typeof children === 'object' && children !== null) {
    return children[currentBreakpoint] ?? children.xs ?? null
  }

  // Otherwise, just render children
  return children
}

/**
 * Hook-based responsive utilities component
 */
export const ResponsiveWrapper = ({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  ...props
}) => {
  const responsiveProps = useResponsiveValue({ xs, sm, md, lg, xl, xxl })

  if (typeof children === 'function') {
    return children(responsiveProps)
  }

  return React.cloneElement(children, { ...props, ...responsiveProps })
}

/**
 * Grid system component that works with breakpoints
 */
export const ResponsiveGrid = ({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 },
  gap = 3,
  className = '',
  ...props
}) => {
  const currentCols = useResponsiveValue(cols)

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${currentCols}, 1fr)`,
    gap: `var(--bs-gap-${gap}, ${gap * 0.25}rem)`,
    ...props.style,
  }

  return (
    <div
      className={`responsive-grid ${className}`}
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Container component with responsive behavior
 */
export const ResponsiveContainer = ({
  children,
  fluid = false,
  breakpoint = null,
  className = '',
  ...props
}) => {
  // Determine if container should be fluid based on breakpoint
  const shouldBeFluid = React.useMemo(() => {
    if (typeof fluid === 'boolean') return fluid
    if (typeof fluid === 'object' && breakpoint) {
      return fluid[breakpoint] ?? false
    }
    return false
  }, [fluid, breakpoint])

  const containerClass = shouldBeFluid ? 'container-fluid' : 'container'

  return (
    <div
      className={`${containerClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Visibility utilities similar to Bootstrap's display utilities
 */
export const Visible = ({ above, below, only, children }) => (
  <Breakpoint
    above={above}
    below={below}
    only={only}
  >
    {children}
  </Breakpoint>
)

export const Hidden = ({ above, below, only, children }) => (
  <Breakpoint
    above={above}
    below={below}
    only={only}
    hide={above || below || only}
  >
    {children}
  </Breakpoint>
)

/**
 * Mobile-first responsive utilities
 */
export const Mobile = ({ children }) => (
  <Breakpoint below="md">{children}</Breakpoint>
)

export const Tablet = ({ children }) => (
  <Breakpoint
    above="sm"
    below="lg"
  >
    {children}
  </Breakpoint>
)

export const Desktop = ({ children }) => (
  <Breakpoint above="lg">{children}</Breakpoint>
)

// Export all components as default
export const BreakpointComponents = {
  Breakpoint,
  Responsive,
  ResponsiveWrapper,
  ResponsiveGrid,
  ResponsiveContainer,
  Visible,
  Hidden,
  Mobile,
  Tablet,
  Desktop,
}

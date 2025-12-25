/**
 * React Bootstrap Breakpoints Utility
 * Based on https://react-bootstrap.netlify.app/docs/layout/breakpoints
 */

export const BREAKPOINTS = {
  // Bootstrap 5 breakpoints (in pixels)
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
}

export const BREAKPOINT_NAMES = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl',
}

export const GRID_COLUMNS = 12

// Media query strings for each breakpoint
export const MEDIA_QUERIES = {
  XS: `(max-width: ${BREAKPOINTS.SM - 1}px)`,
  SM: `(min-width: ${BREAKPOINTS.SM}px) and (max-width: ${BREAKPOINTS.MD - 1}px)`,
  MD: `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`,
  LG: `(min-width: ${BREAKPOINTS.LG}px) and (max-width: ${BREAKPOINTS.XL - 1}px)`,
  XL: `(min-width: ${BREAKPOINTS.XL}px) and (max-width: ${BREAKPOINTS.XXL - 1}px)`,
  XXL: `(min-width: ${BREAKPOINTS.XXL}px)`,
}

// Min-width media queries (for responsive utilities)
export const MIN_MEDIA_QUERIES = {
  XS: `(min-width: ${BREAKPOINTS.XS}px)`,
  SM: `(min-width: ${BREAKPOINTS.SM}px)`,
  MD: `(min-width: ${BREAKPOINTS.MD}px)`,
  LG: `(min-width: ${BREAKPOINTS.LG}px)`,
  XL: `(min-width: ${BREAKPOINTS.XL}px)`,
  XXL: `(min-width: ${BREAKPOINTS.XXL}px)`,
}

// Max-width media queries (for responsive utilities)
export const MAX_MEDIA_QUERIES = {
  XS: `(max-width: ${BREAKPOINTS.SM - 1}px)`,
  SM: `(max-width: ${BREAKPOINTS.MD - 1}px)`,
  MD: `(max-width: ${BREAKPOINTS.LG - 1}px)`,
  LG: `(max-width: ${BREAKPOINTS.XL - 1}px)`,
  XL: `(max-width: ${BREAKPOINTS.XXL - 1}px)`,
}

// Helper functions for responsive props
export const getResponsiveValue = (value, breakpoint) => {
  if (typeof value === 'object') {
    return value[breakpoint] ?? value.xs
  }
  return value
}

// Get current breakpoint based on window width
export const getCurrentBreakpoint = (width) => {
  if (width >= BREAKPOINTS.XXL) return BREAKPOINT_NAMES.XXL
  if (width >= BREAKPOINTS.XL) return BREAKPOINT_NAMES.XL
  if (width >= BREAKPOINTS.LG) return BREAKPOINT_NAMES.LG
  if (width >= BREAKPOINTS.MD) return BREAKPOINT_NAMES.MD
  if (width >= BREAKPOINTS.SM) return BREAKPOINT_NAMES.SM
  return BREAKPOINT_NAMES.XS
}

// Check if width matches breakpoint or higher
export const isMinBreakpoint = (width, breakpoint) => {
  return width >= BREAKPOINTS[breakpoint.toUpperCase()]
}

// Check if width matches breakpoint or lower
export const isMaxBreakpoint = (width, breakpoint) => {
  const maxBreakpoint =
    breakpoint === 'xs'
      ? BREAKPOINTS.SM - 1
      : BREAKPOINTS[breakpoint.toUpperCase()]
  return width <= maxBreakpoint
}

// Bootstrap display utilities mapping
export const DISPLAY_BREAKPOINTS = {
  NONE: 'd-none',
  BLOCK: 'd-block',
  INLINE: 'd-inline',
  INLINE_BLOCK: 'd-inline-block',
  FLEX: 'd-flex',
  INLINE_FLEX: 'd-inline-flex',
  GRID: 'd-grid',
  TABLE: 'd-table',
  TABLE_CELL: 'd-table-cell',
  TABLE_ROW: 'd-table-row',
}

// Generate responsive display classes
export const getResponsiveClass = (display, breakpoint = null) => {
  const baseClass =
    DISPLAY_BREAKPOINTS[display.toUpperCase()] || `d-${display.toLowerCase()}`
  return breakpoint ? `${baseClass}-${breakpoint}` : baseClass
}

// Generate responsive spacing classes
export const getResponsiveSpacingClass = (
  property,
  size,
  breakpoint = null
) => {
  const prefix = {
    margin: 'm',
    padding: 'p',
    top: 'mt',
    bottom: 'mb',
    start: 'ms',
    end: 'me',
    left: 'ms',
    right: 'me',
    x: 'mx',
    y: 'my',
  }

  const classPrefix = prefix[property] || property
  const baseClass = `${classPrefix}-${size}`
  return breakpoint ? `${baseClass}-${breakpoint}` : baseClass
}

// Bootstrap container max-widths
export const CONTAINER_MAX_WIDTHS = {
  SM: '540px',
  MD: '720px',
  LG: '960px',
  XL: '1140px',
  XXL: '1320px',
}

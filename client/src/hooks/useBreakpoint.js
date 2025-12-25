import { useEffect, useState } from 'react'
import {
  BREAKPOINT_NAMES,
  getCurrentBreakpoint,
  isMaxBreakpoint,
  isMinBreakpoint,
  MAX_MEDIA_QUERIES,
  MIN_MEDIA_QUERIES,
} from '../utils/breakpoints.js'

/**
 * Hook for working with React Bootstrap breakpoints
 * Provides current breakpoint information and responsive utilities
 */
export const useBreakpoint = () => {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0
  )
  const [currentBreakpoint, setCurrentBreakpoint] = useState(() =>
    typeof window !== 'undefined'
      ? getCurrentBreakpoint(window.innerWidth)
      : BREAKPOINT_NAMES.XS
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      setCurrentBreakpoint(getCurrentBreakpoint(width))
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Helper functions for breakpoint checks
  const isMin = (breakpoint) => isMinBreakpoint(windowWidth, breakpoint)
  const isMax = (breakpoint) => isMaxBreakpoint(windowWidth, breakpoint)
  const isBetween = (minBreakpoint, maxBreakpoint) =>
    isMin(minBreakpoint) && isMax(maxBreakpoint)

  // Breakpoint-specific helpers
  const isXs = currentBreakpoint === BREAKPOINT_NAMES.XS
  const isSm = currentBreakpoint === BREAKPOINT_NAMES.SM
  const isMd = currentBreakpoint === BREAKPOINT_NAMES.MD
  const isLg = currentBreakpoint === BREAKPOINT_NAMES.LG
  const isXl = currentBreakpoint === BREAKPOINT_NAMES.XL
  const isXxl = currentBreakpoint === BREAKPOINT_NAMES.XXL

  // Responsive helpers
  const isMobile = isMax('sm') // xs and sm
  const isTablet = isBetween('md', 'lg') // md and lg
  const isDesktop = isMin('lg') // lg and up

  return {
    // Current state
    windowWidth,
    currentBreakpoint,

    // Breakpoint checks
    isMin,
    isMax,
    isBetween,

    // Specific breakpoint checks
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,

    // Device type checks
    isMobile,
    isTablet,
    isDesktop,

    // Media queries
    mediaQueries: {
      min: MIN_MEDIA_QUERIES,
      max: MAX_MEDIA_QUERIES,
    },
  }
}

/**
 * Hook for responsive values based on breakpoints
 * @param {Object} values - Object with breakpoint keys (xs, sm, md, lg, xl, xxl)
 * @returns {*} Value for current breakpoint
 */
export const useResponsiveValue = (values) => {
  const { currentBreakpoint } = useBreakpoint()

  // Return value for current breakpoint or fallback to xs
  return values[currentBreakpoint] ?? values.xs
}

/**
 * Hook for responsive boolean based on breakpoints
 * @param {Object} conditions - Object with breakpoint keys and boolean values
 * @returns {boolean} Boolean result for current breakpoint
 */
export const useResponsiveCondition = (conditions) => {
  const { currentBreakpoint } = useBreakpoint()

  return conditions[currentBreakpoint] ?? conditions.xs ?? false
}

/**
 * Hook for media query matching
 * @param {string} query - Media query string
 * @returns {boolean} Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    const handleChange = (e) => setMatches(e.matches)

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [query])

  return matches
}

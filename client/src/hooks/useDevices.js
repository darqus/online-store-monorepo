import useSWR from 'swr'

const fetcher = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    const error = new Error('Network response was not ok')
    error.status = response.status
    throw error
  }
  const data = await response.json()
  // Обрабатываем формат ответа сервера
  return data.success ? data.data : data
}

/**
 * Хук для получения списка устройств с пагинацией
 * @param {number|null} typeId - ID типа устройства
 * @param {number|null} brandId - ID бренда
 * @param {number} page - Номер страницы
 * @param {number} limit - Количество элементов на странице
 * @returns {Object} { devices, totalCount, isLoading, isError, mutate }
 */
export function useDevices(typeId, brandId, page = 1, limit = 5) {
  const params = new URLSearchParams({
    typeId: typeId || '',
    brandId: brandId || '',
    page: page.toString(),
    limit: limit.toString(),
  })

  const { data, error, isLoading, mutate } = useSWR(
    `/api/device?${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
    }
  )

  return {
    devices: data?.rows || [],
    totalCount: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Хук для получения одного устройства
 * @param {string|number} id - ID устройства
 * @returns {Object} { device, isLoading, isError, mutate }
 */
export function useDevice(id) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/device/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    device: data || null,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Хук для получения списка типов
 * @returns {Object} { types, isLoading, isError, mutate }
 */
export function useTypes() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/type',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    types: Array.isArray(data) ? data : [],
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Хук для получения списка брендов
 * @returns {Object} { brands, isLoading, isError, mutate }
 */
export function useBrands() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/brand',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  return {
    brands: Array.isArray(data) ? data : [],
    isLoading,
    isError: error,
    mutate,
  }
}

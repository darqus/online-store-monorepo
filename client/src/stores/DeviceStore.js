import { makeAutoObservable } from 'mobx'
import { fetchDevices as fetchDevicesAPI } from '../http/deviceAPI'
import { showError } from '../utils/notifications'

class DeviceStore {
  constructor() {
    this._types = []
    this._brands = []
    this._devices = []
    this._selectedType = null
    this._selectedBrand = null
    this._pagination = {
      currentPage: 1,
      totalCount: 0,
      limit: 5,
    }
    makeAutoObservable(this)
  }

  setTypes = (types) => {
    this._types = types
  }

  setBrands = (brands) => {
    this._brands = brands
  }

  setDevices = (devices) => {
    this._devices = Array.isArray(devices) ? devices : []
  }

  setSelectedType = (type) => {
    this._selectedType = type
    this._pagination.currentPage = 1
  }

  setSelectedBrand = (brand) => {
    this._selectedBrand = brand
    this._pagination.currentPage = 1
  }

  setPagination = (pagination) => {
    this._pagination = pagination
  }

  fetchDevices = async (typeId, brandId, page, limit) => {
    try {
      const response = await fetchDevicesAPI(typeId, brandId, page, limit)

      // Проверяем структуру ответа
      const devices = response.rows || response.devices || response || []
      const totalCount = response.count || response.total || 0

      this.setDevices(devices)
      this.setPagination({ currentPage: page, totalCount, limit })
    } catch (error) {
      showError('Не удалось загрузить список товаров', error)
      this.setDevices([])
      this.setPagination({ currentPage: 1, totalCount: 0, limit })
    }
  }

  get types() {
    return this._types
  }

  get brands() {
    return this._brands
  }

  get devices() {
    return this._devices
  }

  get selectedType() {
    return this._selectedType
  }

  get selectedBrand() {
    return this._selectedBrand
  }

  get pagination() {
    return this._pagination
  }
}

const deviceStore = new DeviceStore()
export { deviceStore }

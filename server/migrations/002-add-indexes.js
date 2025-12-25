/** @type {import('umzug').MigrationFn} */
export const up = async ({ context: qi }) => {
  // devices: filter indexes and composite
  await qi.addIndex('devices', ['brandId'], { name: 'devices_brandid_idx' })
  await qi.addIndex('devices', ['typeId'], { name: 'devices_typeid_idx' })
  await qi.addIndex('devices', ['brandId', 'typeId'], {
    name: 'devices_brand_type_idx',
  })

  // ratings: queries by deviceId and prevent duplicate user ratings per device
  await qi.addIndex('ratings', ['deviceId'], { name: 'ratings_deviceid_idx' })
  await qi.addIndex('ratings', ['userId', 'deviceId'], {
    unique: true,
    name: 'ratings_user_device_uq',
  })

  // basket_devices: typical lookups and uniqueness per basket
  await qi.addIndex('basket_devices', ['basketId'], {
    name: 'basket_devices_basketid_idx',
  })
  await qi.addIndex('basket_devices', ['deviceId'], {
    name: 'basket_devices_deviceid_idx',
  })
  await qi.addIndex('basket_devices', ['basketId', 'deviceId'], {
    unique: true,
    name: 'basket_devices_basket_device_uq',
  })

  // device_infos: speed include
  await qi.addIndex('device_infos', ['deviceId'], {
    name: 'device_infos_deviceid_idx',
  })
}

/** @type {import('umzug').MigrationFn} */
export const down = async ({ context: qi }) => {
  await qi.removeIndex('device_infos', 'device_infos_deviceid_idx')
  await qi.removeIndex('basket_devices', 'basket_devices_basket_device_uq')
  await qi.removeIndex('basket_devices', 'basket_devices_deviceid_idx')
  await qi.removeIndex('basket_devices', 'basket_devices_basketid_idx')
  await qi.removeIndex('ratings', 'ratings_user_device_uq')
  await qi.removeIndex('ratings', 'ratings_deviceid_idx')
  await qi.removeIndex('devices', 'devices_brand_type_idx')
  await qi.removeIndex('devices', 'devices_typeid_idx')
  await qi.removeIndex('devices', 'devices_brandid_idx')
  // note: users email unique enforced by table definition; no removal needed here
}

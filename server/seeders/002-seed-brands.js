/** @type {import('umzug').MigrationFn} */
export const up = async ({ context: qi }) => {
  const now = new Date()
  await qi.bulkInsert('brands', [
    { name: 'Apple', createdAt: now, updatedAt: now },
    { name: 'Samsung', createdAt: now, updatedAt: now },
    { name: 'Lenovo', createdAt: now, updatedAt: now },
  ])
}

/** @type {import('umzug').MigrationFn} */
export const down = async ({ context: qi }) => {
  await qi.bulkDelete('brands', { name: ['Apple', 'Samsung', 'Lenovo'] })
}

/** @type {import('umzug').MigrationFn} */
export const up = async ({ context: qi }) => {
  const now = new Date()
  await qi.bulkInsert('types', [
    { name: 'smartphone', createdAt: now, updatedAt: now },
    { name: 'laptop', createdAt: now, updatedAt: now },
    { name: 'tablet', createdAt: now, updatedAt: now },
  ])
}

/** @type {import('umzug').MigrationFn} */
export const down = async ({ context: qi }) => {
  await qi.bulkDelete('types', { name: ['smartphone', 'laptop', 'tablet'] })
}

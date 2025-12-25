import { createMigrator } from './migrator.js'

const run = async () => {
  const migrator = createMigrator()
  const direction = process.argv[2] || 'up'
  if (direction === 'down') {
    await migrator.down()
  } else {
    await migrator.up()
  }
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

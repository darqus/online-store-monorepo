import { createSeeder } from './migrator.js'

const run = async () => {
  const seeder = createSeeder()
  const direction = process.argv[2] || 'up'
  if (direction === 'down') {
    await seeder.down()
  } else {
    await seeder.up()
  }
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

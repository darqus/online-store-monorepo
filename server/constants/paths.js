import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const STATIC_DIR = path.resolve(__dirname, '../static')
export const STATIC_IMAGES_PATH = path.resolve(STATIC_DIR, 'images')

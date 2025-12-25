import { config } from '../config/index.js'
import { STATIC_IMAGES_PATH } from '../constants/paths.js'
import path from 'path'
import fs from 'fs'

let s3 = null
let getSignedUrl = null

const isS3 = () => config.storage?.driver === 's3'

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true })

const initS3 = () => {
  if (!isS3() || s3) {
    return
  }
  const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
  } = require('@aws-sdk/client-s3')
  const { getSignedUrl: _gsu } = require('@aws-sdk/s3-request-presigner')
  s3 = {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    client: null,
  }
  s3.client = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: process.env.S3_ACCESS_KEY_ID
      ? {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
      : undefined,
  })
  getSignedUrl = _gsu
}

export const storage = {
  async saveLocal(file, fileName) {
    ensureDir(STATIC_IMAGES_PATH)
    await file.mv(path.resolve(STATIC_IMAGES_PATH, fileName))
    return { key: fileName, url: `/static/images/${fileName}` }
  },
  async saveS3(file, fileName, mimeType) {
    initS3()
    const Key = fileName
    const Bucket = process.env.S3_BUCKET
    const Body = file.data
    const ContentType = mimeType
    await s3.client.send(
      new s3.PutObjectCommand({
        Bucket,
        Key,
        Body,
        ContentType,
        ACL: 'private',
      })
    )
    const url = await getSignedUrl(s3.client, new s3.GetObjectCommand({ Bucket, Key }), {
      expiresIn: 60 * 60,
    })
    return { key: Key, url }
  },
  async save(file, fileName, mimeType) {
    if (isS3()) {
      return this.saveS3(file, fileName, mimeType)
    }
    return this.saveLocal(file, fileName)
  },
  async remove(key) {
    if (isS3()) {
      initS3()
      const Bucket = process.env.S3_BUCKET
      await s3.client.send(new s3.DeleteObjectCommand({ Bucket, Key: key }))
      return
    }
    const p = path.resolve(STATIC_IMAGES_PATH, key)
    if (fs.existsSync(p)) {
      fs.unlinkSync(p)
    }
  },
  async url(key) {
    if (isS3()) {
      initS3()
      const Bucket = process.env.S3_BUCKET
      return getSignedUrl(s3.client, new s3.GetObjectCommand({ Bucket, Key: key }), {
        expiresIn: 60 * 60,
      })
    }
    return `/static/images/${key}`
  },
}

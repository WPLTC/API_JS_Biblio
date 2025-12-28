import admin from 'firebase-admin'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const serviceAccount = JSON.parse(
  await fs.promises.readFile(
    path.join(__dirname, './firebase-config.json'), 
    'utf8'
  )
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

export const db = admin.firestore()

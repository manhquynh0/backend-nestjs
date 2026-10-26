
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import z from 'zod'
if (!fs.existsSync(path.resolve('.env'))) {
  process.exit(1)
}

dotenv.config()

const configSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  SECRET_API_KEY: z.string(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PHONE_NUMBER: z.string(),
  OTP_EXPIRES_IN: z.string(),
  BREVO_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_URI: z.string(),
  GOOGLE_CALLBACK: z.string(),
})

const configServer = configSchema.safeParse(process.env)
if (!configServer.success) {
  console.log('Các giá trị khai báo trong file .env không hợp lệ')
  console.log(configServer.error.issues)
  process.exit(1)
}
const envConfig = configServer.data
export default envConfig

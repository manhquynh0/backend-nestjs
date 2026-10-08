import { plainToInstance } from 'class-transformer'
import { IsDate, IsString, validateSync } from 'class-validator'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

if (!fs.existsSync(path.resolve('.env'))) {
    process.exit(1)
}

dotenv.config()

class ConfigSchema {
    @IsString()
    DATABASE_URL: string
    @IsString()
    ACCESS_TOKEN_SECRET: string
    @IsString()
    REFRESH_TOKEN_SECRET: string
    @IsString()
    REFRESH_TOKEN_EXPIRES_IN: string
    @IsString()
    ACCESS_TOKEN_EXPIRES_IN: string
}

const configServer = plainToInstance(ConfigSchema, process.env)
const e = validateSync(configServer)
if (e.length > 0) {
    console.log("Các giá trị khai báo trong file .env không hợp lệ")
    const errors = e.map((eItem) => {
        return {
            property: eItem.property,
            constraints: eItem.constraints,
            value: eItem.value

        }
    })
    throw errors

}
const envConfig = configServer
export default envConfig

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import './shared/config.js'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //tự động loại bỏ các field không được khai báo decorator trong dto
      forbidNonWhitelisted: true, // Nếu có field không được khai báo trong decorator trong dto mà client truyền lên thì báo lỗi
      transform: true, // tự động chuyển kiểu dữ liệu sang kiểu được khai báo trong dto
      transformOptions: {
        enableImplicitConversion: true
      },
      exceptionFactory: (validatorErrors) => {
        console.log(validatorErrors)
        return new UnprocessableEntityException(validatorErrors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints ?? {}).join(',')
        })))
      }

    })
  )
  await app.listen(process.env.PORT ?? 3000)
}
await bootstrap()

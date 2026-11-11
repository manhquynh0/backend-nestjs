import { createZodDto } from 'nestjs-zod'
import { GetQuerySchema, GetParamsSchema, CreateUserSchema, GetUserResSchema, UpdateUserSchema, ResUsersSchema } from "./user.model.js"

export class GetQueryDto extends createZodDto(GetQuerySchema) { }
export class GetParamsDto extends createZodDto(GetParamsSchema) { }
export class CreateUserDto extends createZodDto(CreateUserSchema) { }
export class UpdateUserDto extends createZodDto(UpdateUserSchema) { }
export class ResUserDto extends createZodDto(GetUserResSchema) { }
export class ResUsersDto extends createZodDto(ResUsersSchema) { }
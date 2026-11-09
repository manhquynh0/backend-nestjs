import { createZodDto } from 'nestjs-zod'
import { UpdateProfileSchema, ChangePassWordSchema, ResponseUpdateSchema, ResponseChangePassWordSchema, ResProfileSchema } from './profile.model.js'
export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) { }
export class ChangePassWordDto extends createZodDto(ChangePassWordSchema) { }
export class ResponseUpdateDto extends createZodDto(ResponseUpdateSchema) { }
export class ResponseChangePassWordDto extends createZodDto(ResponseChangePassWordSchema) { }
export class GetProfileDto extends createZodDto(ResProfileSchema) { }
export class ResProfileDto extends createZodDto(ResProfileSchema) { }
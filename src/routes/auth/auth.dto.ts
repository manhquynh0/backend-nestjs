import { createZodDto } from "nestjs-zod"
import { RegisterBodySchema, RegisterResSchema, SendOtpBodySchema } from "./auth.model.js"

export class RegisterDTO extends createZodDto(RegisterBodySchema) { }
export class RegisterResDTO extends createZodDto(RegisterResSchema) { }
export class SendOtpDTO extends createZodDto(SendOtpBodySchema) { }
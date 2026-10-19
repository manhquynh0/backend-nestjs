import { createZodDto } from "nestjs-zod"
import { RegisterBodySchema, RegisterResSchema } from "./auth.model.js"

export class RegisterDTO extends createZodDto(RegisterBodySchema) { }
export class RegisterResDTO extends createZodDto(RegisterResSchema) { }
import { createZodDto } from "nestjs-zod"
import { LanguageBodySchema, GetLanguageParamsSchema, LanguageCreateBodySchema, LanguageUpdateBodySchema, GetLanguageResSchema, GetLanguageDetailResSchema } from "./lang.model.js"
export class GetLanguageParamsDTO extends createZodDto(GetLanguageParamsSchema) { }
export class GetLanguageResDTO extends createZodDto(GetLanguageResSchema) { }
export class GetLanguageDetailResDTO extends createZodDto(GetLanguageDetailResSchema) { }
export class LanguageBodyDTO extends createZodDto(LanguageBodySchema) { }
export class LanguageCreateBodyDTO extends createZodDto(LanguageCreateBodySchema) { }
export class LanguageUpdateBodyDTO extends createZodDto(LanguageUpdateBodySchema) { }


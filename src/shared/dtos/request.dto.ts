import { createZodDto } from "nestjs-zod";
import { EmptyBodySchema } from "../model/request.model.js";
export class EmptyBodyDTO extends createZodDto(EmptyBodySchema) { }
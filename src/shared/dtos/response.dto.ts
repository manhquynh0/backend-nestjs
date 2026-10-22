import { createZodDto } from "nestjs-zod";
import { MessageResSchema } from "../model/response.model.js";
export class MessageResDTO extends createZodDto(MessageResSchema) { }
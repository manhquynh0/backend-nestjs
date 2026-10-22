import { createZodDto } from "nestjs-zod"
import { LoginBodySchema, RegisterBodySchema, RegisterResSchema, SendOtpBodySchema, RefreshTokenBodySchema, RefreshTokenResSchema, LoginResSchema, LogoutBodySchema } from "./auth.model.js"
import { MessageResSchema } from "~/shared/model/response.model.js"

export class RegisterDTO extends createZodDto(RegisterBodySchema) { }
export class RegisterResDTO extends createZodDto(RegisterResSchema) { }
export class SendOtpDTO extends createZodDto(SendOtpBodySchema) { }
export class LoginDTO extends createZodDto(LoginBodySchema) { }
export class LoginResDTO extends createZodDto(LoginResSchema) { }
export class RefreshTokenDTO extends createZodDto(RefreshTokenBodySchema) { }
export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) { }
export class LogoutDTO extends createZodDto(LogoutBodySchema) { }
export class MessageResDTO extends createZodDto(MessageResSchema) { }
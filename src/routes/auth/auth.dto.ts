import { createZodDto } from "nestjs-zod"
import { LoginBodySchema, RegisterBodySchema, RegisterResSchema, SendOtpBodySchema, RefreshTokenBodySchema, RefreshTokenResSchema, LoginResSchema } from "./auth.model.js"

export class RegisterDTO extends createZodDto(RegisterBodySchema) { }
export class RegisterResDTO extends createZodDto(RegisterResSchema) { }
export class SendOtpDTO extends createZodDto(SendOtpBodySchema) { }
export class LoginDTO extends createZodDto(LoginBodySchema) { }
export class LoginResDTO extends createZodDto(LoginResSchema) { }
export class RefreshTokenDTO extends createZodDto(RefreshTokenBodySchema) { }
export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) { }
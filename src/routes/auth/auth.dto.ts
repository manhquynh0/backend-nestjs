import { Exclude, Expose } from "class-transformer"
import { IsString, Length } from "class-validator"
import { Match } from "~/shared/decorators/custom-validator.decorators.js"

export class LoginBodyDTO {
    @IsString()
    email: string
    @IsString()
    @Length(8, 16)
    password: string
}
export class LoginResDTO {
    accessToken: string
    refreshToken: string
    constructor(
        partial: Partial<LoginResDTO>) {
        Object.assign(this, partial)
    }
}
export class RegisterBodyDTO extends LoginBodyDTO {
    @IsString()
    name: string
    @IsString()
    @Match('password', { message: 'Confirm password do not match' })
    confirmPassword: string
}
export class RegisterResDTO {
    id: number
    email: string
    @Exclude()
    password: string
    createAt: Date
    updateAt: Date
    @Expose()
    get emailName() {
        return `${this.email} - ${this.password}`
    }
    constructor(
        partial: Partial<RegisterResDTO>) {
        Object.assign(this, partial)
    }
}
export class RefreshTokenBodyDTO {
    @IsString()
    refreshToken: string
}
export class RefreshTokenResDTO {
    accessToken: string
    constructor(partial: Partial<RefreshTokenResDTO>) {
        Object.assign(this, partial)
    }
}

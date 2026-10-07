import { Exclude, Expose } from "class-transformer"
import { IsString } from "class-validator"

export class LoginBodyDTO {
    @IsString()
    email: string
    @IsString()
    password: string
}
export class RegisterBodyDTO extends LoginBodyDTO {
    @IsString()
    name: string
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
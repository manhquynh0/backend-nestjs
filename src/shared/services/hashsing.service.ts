import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt'
@Injectable()
export class HashsingService {
    hash(value: string) {
        return hash(value, 10)
    }
    compare(value: string, hash: string) {
        return compare(value, hash)
    }
}

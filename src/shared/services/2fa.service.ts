import { Injectable } from "@nestjs/common";
import * as OTPAuth from "otpauth";
// import * as OTPAuth from "otpauth/slim"; // Slim build without bundled dependencies.
// import * as OTPAuth from "otpauth/bare"; // Bare build with no bundled crypto (requires providing a custom HMAC function).
@Injectable()
export class TwoFactorAuthService {
    private createOTP(email: string, secret?: string) {
        return new OTPAuth.TOTP({
            // Provider or service the account is associated with.
            issuer: "SHOPPE CLONE",
            // Account identifier.
            label: email,
            // Algorithm used for the HMAC function, possible values are:
            //   "SHA1", "SHA224", "SHA256", "SHA384", "SHA512",
            //   "SHA3-224", "SHA3-256", "SHA3-384" and "SHA3-512".
            algorithm: "SHA1",
            // Length of the generated tokens.
            digits: 6,
            // Interval of time for which a token is valid, in seconds.
            period: 30,
            // Arbitrary key encoded in base32 or `OTPAuth.Secret` instance
            // (if omitted, a cryptographically secure random secret is generated).
            secret: secret || new OTPAuth.Secret(),
            //   or: `OTPAuth.Secret.fromBase32("US3WHSG7X5KAPV27VANWKQHF3SH3HULL")`
            //   or: `new OTPAuth.Secret()`
            // Custom HMAC function (required for bare build, optional otherwise).
            // hmac: (algorithm, key, message) => Uint8Array,
        });

    }
    generateOTPSecret(email: string) {
        const totp = this.createOTP(email)
        return {
            secret: totp.secret.base32,
            uri: totp.toString(),
        }
    }
    verifyOTP(email: string, secret: string, token: string): boolean {
        const totp = this.createOTP(email, secret)
        const delta = totp.validate({ token, window: 1 })
        return delta !== null
    }
}

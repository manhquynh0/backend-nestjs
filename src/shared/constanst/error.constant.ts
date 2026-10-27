
export const ErrorCode = {
    // Lỗi xác thực & phân quyền
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',

    // Lỗi nghiệp vụ
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
    RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
    INVALID_OTP: 'INVALID_OTP',

    // Lỗi hệ thống
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]

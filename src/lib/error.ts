const ERROR_CODES = {
    ERROR: 'ERROR',
    INPUT_VALIDATION_ERROR: 'INPUT_VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    BAD_REQUEST: 'BAD_REQUEST',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
} as const

export type ActionErrorSerialize = {
    name: string
    code: keyof typeof ERROR_CODES
    message: string
    inputError?: { name: string; message: string }
}

export class ActionError extends Error {
    code: keyof typeof ERROR_CODES

    constructor(message: string, code: keyof typeof ERROR_CODES = 'ERROR') {
        super(message)
        this.name = 'ActionError'
        this.code = ERROR_CODES[code]
    }

    serialize(): ActionErrorSerialize {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
        }
    }
}

export class InputError extends ActionError {
    inputError: { name: string; message: string }

    constructor(name: string, message: string) {
        super(message, 'INPUT_VALIDATION_ERROR')
        this.name = 'InputError'
        this.inputError = {
            name,
            message,
        }
    }

    serialize(): ActionErrorSerialize {
        return {
            ...super.serialize(),
            inputError: this.inputError,
        }
    }
}

import { type ClassValue, clsx } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { ActionResult } from './types'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function errorResult(message: string, data?: any): ActionResult {
    return {
        status: 'error',
        message,
        data,
    }
}

export function successResult<T>(message: string, data?: any): ActionResult {
    return {
        status: 'success',
        message,
        data,
    }
}

export function showToastFromActionResult<T>(result: ActionResult) {
    if (!result) return

    if (result.status === 'success') {
        toast.success(result.message)
    } else if (result.status === 'error') {
        toast.error(result.message)
    }
}

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ActionResult } from './types'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function actionResult(status: 'success' | 'error', message: string, data?: any): ActionResult {
    if (status === 'success') {
        return [null, { message, data }]
    }
    return [{ message, data }, null]
}

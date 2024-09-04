'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

interface Props {
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
}

export function Toast({ message, type }: Props) {
    useEffect(() => {
        if (type === 'success') {
            toast.success(message)
        } else if (type === 'error') {
            toast.error(message)
        } else if (type === 'info') {
            toast.info(message)
        } else if (type === 'warning') {
            toast.warning(message)
        }
    }, [message, type])

    return null
}

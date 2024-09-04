'use client'

import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './ui/button'

interface Props extends ButtonProps {
    isLoading?: boolean
}

export function SubmitButton({ children, disabled, isLoading, ...rest }: Props) {
    const { pending } = useFormStatus()
    const _disabled = pending || disabled || isLoading
    const _isLoading = pending || isLoading

    return (
        <Button type='submit' size='sm' disabled={_disabled} {...rest}>
            {_isLoading ? <Loader2 className='animate-spin' /> : children}
        </Button>
    )
}

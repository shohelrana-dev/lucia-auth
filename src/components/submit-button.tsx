'use client'

import { useFormStatus } from 'react-dom'
import { BeatLoader } from 'react-spinners'
import { Button, ButtonProps } from './ui/button'

interface Props extends ButtonProps {
    isSubmitting?: boolean
}

export function SubmitButton({ children, isSubmitting, ...rest }: Props) {
    const { pending } = useFormStatus()

    if (isSubmitting || pending) {
        return (
            <Button size='sm' disabled={true} {...rest}>
                <BeatLoader size={8} color={rest.variant === 'outline' ? '#000' : '#fff'} />
            </Button>
        )
    }
    return (
        <Button type='submit' size='sm' {...rest}>
            {children}
        </Button>
    )
}

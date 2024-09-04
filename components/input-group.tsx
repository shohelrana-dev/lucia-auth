import { forwardRef, Ref } from 'react'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'
import { Input, InputProps } from './ui/input'
import { Label } from './ui/label'

interface InputGroupProps extends InputProps {
    error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>
    label?: string
}

export const InputGroup = forwardRef(
    ({ error, label, ...rest }: InputGroupProps, ref: Ref<HTMLInputElement>) => {
        return (
            <>
                {label && <Label>{label}</Label>}
                <Input {...rest} ref={ref} />
                {error && <p className='text-red-500 text-sm -mt-1'>{error.message?.toString()}</p>}
            </>
        )
    }
)

InputGroup.displayName = 'InputGroup'

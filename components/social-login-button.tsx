'use client'

import { Loader2 } from 'lucide-react'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import { useFormStatus } from 'react-dom'
import { Button } from './ui/button'

interface Props {
    name: string
    icon: StaticImport
}

export function SocialLoginButton({ name, icon }: Props) {
    const status = useFormStatus()

    return (
        <Button variant='outline' size='sm' className='gap-1 text-muted-foreground w-full' type='submit'>
            {status.pending ? (
                <Loader2 className='animate-spin' />
            ) : (
                <>
                    <Image src={icon} alt={name} width={20} height={20} /> {name}
                </>
            )}
        </Button>
    )
}

import { Toast } from '@/components/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Ban } from 'lucide-react'
import Link from 'next/link'

export default function MagicErrorPage() {
    return (
        <main className='min-h-screen flex flex-col items-center justify-center bg-light-gray'>
            <Toast message={'Login attempt failed! Please try again.'} type='error' />

            <Card className='w-full max-w-[380px] mb-32 bg-white'>
                <CardHeader className='text-center'>
                    <h2 className='text-2xl font-extrabold'>
                        <div className='flex items-center justify-center mb-3'>
                            <Ban size={60} className='text-destructive' />
                        </div>
                        <p>Magic link error!</p>
                    </h2>
                </CardHeader>

                <CardContent>
                    <p className='text-sm text-gray-500 text-center'>
                        You tried to login with a magic link, but the link is invalid or expired.
                    </p>
                </CardContent>
                <CardFooter className='flex flex-col items-center'>
                    <Link href='/login' className='w-full'>
                        <Button variant='outline' className='w-full mt-3'>
                            Back to login
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </main>
    )
}

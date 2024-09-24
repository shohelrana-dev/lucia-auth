import { Card } from '@/components/ui/card'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='min-h-screen flex flex-col items-center justify-center bg-light-gray'>
            <Card className='w-full max-w-[380px] mb-32 bg-white'>{children}</Card>
        </main>
    )
}

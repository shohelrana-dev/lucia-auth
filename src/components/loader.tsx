import { Loader2 } from 'lucide-react'

export function Loader() {
    return (
        <div className='flex items-center justify-center py-8'>
            <Loader2 className='animate-spin' size={35} />
        </div>
    )
}

import { Separator } from './ui/separator'

export function Divider({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex items-center gap-4 my-5'>
            <Separator className='flex-1' />
            <span className='text-muted-foreground text-xs'>{children}</span>
            <Separator className='flex-1' />
        </div>
    )
}

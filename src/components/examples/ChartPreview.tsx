import React from 'react'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'

export default function ChartPreview({
  children,
  className,
}: {
  children: React.ReactElement
  className?: string
}) {
  return (
    <Dialog>
      <div className={cn('relative h-64', className)}>
        <DialogTrigger asChild>
          <button className='absolute right-2 top-2 rounded-md bg-background/80 p-1 text-muted-foreground hover:text-foreground'>
            <Eye className='h-4 w-4' />
            <span className='sr-only'>View larger</span>
          </button>
        </DialogTrigger>
        {children}
      </div>
      <DialogContent className='inset-0 h-screen w-screen translate-x-0 translate-y-0 max-w-none rounded-none p-4'>
        {React.cloneElement(children)}
      </DialogContent>
    </Dialog>
  )
}

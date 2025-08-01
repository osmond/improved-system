import React from 'react'
import { Eye, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogContentFullscreen,
  DialogClose,
} from '@/components/ui/dialog'


export default function ChartPreview({
  children,
  className,
}: {
  children: React.ReactElement
  className?: string
}) {
  return (
    <Dialog>
      <div className={cn('relative h-64 overflow-hidden', className)}>
        <DialogTrigger asChild>
          <button className='absolute right-2 top-2 z-40 rounded-md bg-background/80 p-1 text-muted-foreground hover:text-foreground'>
            <Eye className='h-4 w-4' />
            <span className='sr-only'>View larger</span>
          </button>
        </DialogTrigger>
        {children}
      </div>
      <DialogContentFullscreen className="relative">
        <DialogClose asChild>
          <button className="absolute right-4 top-4 z-50 rounded-md bg-background/80 p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
        {React.cloneElement(children)}
      </DialogContentFullscreen>
    </Dialog>
  )
}

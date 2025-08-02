import React from 'react'
import { Eye, XCircle } from 'lucide-react'

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
      <div className={cn("relative overflow-hidden mb-6 break-inside-avoid", className)}>
        <DialogTrigger asChild>
          <button className='absolute right-2 top-2 z-40 rounded-md bg-background/80 p-1 text-muted-foreground hover:text-foreground hover:animate-blink'>
            <Eye className='h-4 w-4' />
            <span className='sr-only'>View larger</span>
          </button>
        </DialogTrigger>
        {children}
      </div>
      <DialogContentFullscreen>
        <DialogClose asChild>
          <button
            className='absolute right-4 top-4 z-50 rounded-full bg-background/80 p-2 text-muted-foreground shadow transition-transform duration-150 hover:rotate-90 hover:scale-110 hover:text-foreground focus:outline-none focus:ring-2'
          >
            <XCircle className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </button>
        </DialogClose>
        {
          React.isValidElement(children)
            ? React.createElement(children.type, {
                ...children.props,
                key: 'dialog',
              })
            : children
        }
      </DialogContentFullscreen>
    </Dialog>
  )
}

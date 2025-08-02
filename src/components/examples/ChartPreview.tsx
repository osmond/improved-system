import React from 'react'
import { Eye, XCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogTrigger,
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
  const [open, setOpen] = React.useState(false)
  const [coords, setCoords] = React.useState<{ x: number; y: number } | null>(null)

  const handleOpenChange = (o: boolean) => {
    setOpen(o)
    if (!o) {
      setCoords(null)
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    setCoords({ x: e.clientX, y: e.clientY })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className={cn("relative overflow-hidden mb-6 break-inside-avoid", className)}>
        <DialogTrigger asChild>
          <button className='absolute right-2 top-2 z-40 rounded-md bg-background/80 p-1 text-muted-foreground transition-transform hover:scale-110 hover:text-foreground'>
            <Eye className='h-4 w-4' />
            <span className='sr-only'>View larger</span>
          </button>
        </DialogTrigger>
        {children}
      </div>
      <DialogContentFullscreen
        className='relative flex flex-col'
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setCoords(null)}
      >
        {coords && (
          <DialogClose
            className='absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-muted-foreground shadow transition-transform duration-150 hover:rotate-90 hover:scale-110 hover:text-foreground focus:outline-none focus:ring-2'
            style={{ top: coords.y, left: coords.x }}
          >
            <XCircle className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </DialogClose>
        )}
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

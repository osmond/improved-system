import React from 'react'
import { Eye } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContentFullscreen } from '@/components/ui/dialog'

export default function ChartPreview({ children }: { children: React.ReactElement }) {
  return (
    <Dialog>
      <div className='relative'>
        <DialogTrigger asChild>
          <button className='absolute right-2 top-2 z-40 rounded-md bg-background/80 p-1 text-muted-foreground hover:text-foreground'>
            <Eye className='h-4 w-4' />
            <span className='sr-only'>View larger</span>
          </button>
        </DialogTrigger>
        {children}
      </div>
      <DialogContentFullscreen>
        {React.cloneElement(children)}
      </DialogContentFullscreen>
    </Dialog>
  )
}

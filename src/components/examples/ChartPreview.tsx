import React from 'react'
import { Eye } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'

export default function ChartPreview({ children }: { children: React.ReactElement }) {
  return (
    <Dialog>
      <div className='relative'>
        <DialogTrigger asChild>
          <button className='absolute right-2 top-2 rounded-md bg-background/80 p-1 text-muted-foreground hover:text-foreground'>
            <Eye className='h-4 w-4' />
            <span className='sr-only'>View larger</span>
          </button>
        </DialogTrigger>
        {children}
      </div>
      <DialogContent className='w-[90vw] max-w-3xl p-4'>
        {React.cloneElement(children)}
      </DialogContent>
    </Dialog>
  )
}

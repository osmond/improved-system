import React from 'react'
import { Eye, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className={cn("relative overflow-hidden mb-6 break-inside-avoid", className)}>
        <DialogTrigger asChild>
          <button className='absolute right-2 top-2 z-40 rounded-md bg-background/80 p-1 text-muted-foreground transition-transform hover:scale-110 hover:text-foreground'>
            <Eye className='h-4 w-4' />
            <span className='sr-only'>View larger</span>
          </button>
        </DialogTrigger>
        {children}
      </div>
      <DialogContentFullscreen className='flex flex-col'>
        <div className='flex justify-end'>
          <DialogClose asChild>
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className='rounded-full bg-background/80 p-2 text-muted-foreground shadow transition-transform duration-150 hover:rotate-90 hover:scale-110 hover:text-foreground focus:outline-none focus:ring-2'
            >
              <XCircle className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </motion.button>
          </DialogClose>
        </div>
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

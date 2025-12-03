'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ROOT
function Accordion(
  props: React.ComponentProps<typeof AccordionPrimitive.Root>
) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

// ITEM
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  )
}

// TRIGGER — FUTURE-PROOF, BUTTON-FREE, SAFE
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger asChild {...props}>
        <div
          className={cn(
            'flex flex-1 items-start justify-between gap-4 py-4 text-left text-sm font-medium cursor-pointer select-none outline-none transition-all hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:text-foreground',
            className
          )}
        >
          {children}

          <ChevronDownIcon
            className={cn(
              'pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200',
              'data-[state=open]:rotate-180'
            )}
          />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

// CONTENT
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

// EXPORT
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

import { useLayoutEffect, useRef } from "react"

import { cn } from "@/lib/utils"

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>

// A borderless textarea that grows with its content so notes read like a
// document instead of a fixed-height form field.
export default function AutoTextarea({ className, value, ...props }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  // Re-measure whenever the (controlled) value changes — this covers both
  // typing and external updates, since the parent re-renders with a new value.
  // biome-ignore lint/correctness/useExhaustiveDependencies: resize is keyed on `value`
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      rows={1}
      className={cn(
        "w-full resize-none overflow-hidden border-none bg-transparent p-0 outline-none",
        "placeholder:text-muted-foreground/60 focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  )
}

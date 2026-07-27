import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Props {
  /** Absolute moment the countdown reaches zero. */
  deadline: Date
  /** Fired exactly once, when the deadline is reached. */
  onExpire?: () => void
}

function remainingSeconds(deadline: Date): number {
  return Math.max(0, Math.round((deadline.getTime() - Date.now()) / 1000))
}

function format(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export default function Countdown({ deadline, onExpire }: Props) {
  const [seconds, setSeconds] = useState(() => remainingSeconds(deadline))
  const firedRef = useRef(false)

  useEffect(() => {
    // Re-arm if the deadline changes.
    firedRef.current = false
    setSeconds(remainingSeconds(deadline))

    const tick = () => {
      const left = remainingSeconds(deadline)
      setSeconds(left)
      if (left <= 0 && !firedRef.current) {
        firedRef.current = true
        onExpire?.()
      }
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [deadline, onExpire])

  const danger = seconds <= 60

  return (
    <Badge
      variant={danger ? "destructive" : "secondary"}
      className={cn("font-mono tabular-nums", danger && "animate-pulse")}
      aria-live="polite"
    >
      ⏱ {format(seconds)}
    </Badge>
  )
}

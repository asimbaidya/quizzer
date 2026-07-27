import { act, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import Countdown from "./Countdown"

describe("Countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
  })
  afterEach(() => vi.useRealTimers())

  const inSeconds = (s: number) => new Date(Date.now() + s * 1000)
  const advance = (s: number) => act(() => vi.advanceTimersByTime(s * 1000))

  it("renders the initial remaining time", () => {
    render(<Countdown deadline={inSeconds(90)} />)
    expect(screen.getByText(/01:30/)).toBeInTheDocument()
  })

  it("ticks down once per second", () => {
    render(<Countdown deadline={inSeconds(90)} />)
    advance(1)
    expect(screen.getByText(/01:29/)).toBeInTheDocument()
    advance(29)
    expect(screen.getByText(/01:00/)).toBeInTheDocument()
  })

  it("fires onExpire exactly once when the deadline is reached", () => {
    const onExpire = vi.fn()
    render(<Countdown deadline={inSeconds(2)} onExpire={onExpire} />)
    advance(2)
    expect(onExpire).toHaveBeenCalledTimes(1)
    // Keep ticking past zero — it must not fire again.
    advance(5)
    expect(onExpire).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/00:00/)).toBeInTheDocument()
  })

  it("switches to the danger state at 60 seconds or fewer", () => {
    const { container } = render(<Countdown deadline={inSeconds(61)} />)
    expect(container.querySelector(".animate-pulse")).toBeNull()
    advance(1) // now 60s remaining
    expect(container.querySelector(".animate-pulse")).not.toBeNull()
  })

  it("re-arms and can fire again when the deadline prop changes", () => {
    const onExpire = vi.fn()
    const { rerender } = render(
      <Countdown deadline={inSeconds(1)} onExpire={onExpire} />,
    )
    advance(1)
    expect(onExpire).toHaveBeenCalledTimes(1)

    rerender(<Countdown deadline={inSeconds(1)} onExpire={onExpire} />)
    advance(1)
    expect(onExpire).toHaveBeenCalledTimes(2)
  })

  it("clears its interval on unmount", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval")
    const { unmount } = render(<Countdown deadline={inSeconds(90)} />)
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })
})

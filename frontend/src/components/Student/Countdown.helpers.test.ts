import { afterEach, describe, expect, it, vi } from "vitest"

import { format, remainingSeconds } from "./Countdown"

describe("format", () => {
  it.each([
    [0, "00:00"],
    [5, "00:05"],
    [65, "01:05"],
    [600, "10:00"],
    [3599, "59:59"],
    [3600, "1:00:00"],
    [3661, "1:01:01"],
    [36000, "10:00:00"],
  ])("formats %d seconds as %s", (seconds, expected) => {
    expect(format(seconds)).toBe(expected)
  })
})

describe("remainingSeconds", () => {
  afterEach(() => vi.useRealTimers())

  it("returns the rounded seconds until a future deadline", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const deadline = new Date("2026-01-01T00:01:30Z")
    expect(remainingSeconds(deadline)).toBe(90)
  })

  it("clamps to 0 for a deadline in the past", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
    const deadline = new Date("2025-12-31T23:59:00Z")
    expect(remainingSeconds(deadline)).toBe(0)
  })
})

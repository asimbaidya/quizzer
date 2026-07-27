import { AxiosError } from "axios"
import { describe, expect, it, vi } from "vitest"

import { ApiError } from "./client"
import type { ApiRequestOptions } from "./client/core/ApiRequestOptions"
import { getInitials, handleError } from "./utils"

// Build an ApiError with an arbitrary body, mirroring the generated client.
function makeApiError(body: unknown, status = 400): ApiError {
  const request = {} as ApiRequestOptions
  return new ApiError(
    request,
    { url: "/x", ok: false, status, statusText: "Bad Request", body },
    "error",
  )
}

describe("handleError", () => {
  it("uses the AxiosError message when the error is an AxiosError", () => {
    const sink = vi.fn()
    handleError.call(sink, new AxiosError("Network Error") as never)
    expect(sink).toHaveBeenCalledWith("Network Error")
  })

  it("extracts the first message from a FastAPI validation detail array", () => {
    const sink = vi.fn()
    handleError.call(
      sink,
      makeApiError({ detail: [{ msg: "field required" }, { msg: "second" }] }),
    )
    expect(sink).toHaveBeenCalledWith("field required")
  })

  it("uses a plain string detail", () => {
    const sink = vi.fn()
    handleError.call(sink, makeApiError({ detail: "Not found" }))
    expect(sink).toHaveBeenCalledWith("Not found")
  })

  it("falls back to a generic message when there is no detail", () => {
    const sink = vi.fn()
    handleError.call(sink, makeApiError({}))
    expect(sink).toHaveBeenCalledWith("Something went wrong.")
  })
})

describe("getInitials", () => {
  it.each([
    ["Ada Lovelace", "AL"],
    ["grace hopper", "GH"],
    ["Margaret", "M"],
    ["Alan Mathison Turing", "AM"], // only the first two words
  ])("maps %s -> %s", (name, expected) => {
    expect(getInitials(name)).toBe(expected)
  })
})

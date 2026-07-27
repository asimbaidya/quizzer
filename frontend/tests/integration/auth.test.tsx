import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"

import { api } from "../mocks/handlers"
import { server } from "../mocks/server"
import { renderRoute } from "../utils/renderRoute"

describe("Route guards", () => {
  it("redirects to /login when visiting a protected route logged out", async () => {
    renderRoute({ initialPath: "/", token: null })
    // The login screen renders instead of the app home.
    expect(
      await screen.findByRole("heading", { name: /login to your account/i }),
    ).toBeInTheDocument()
  })

  it("redirects away from /login when already authenticated", async () => {
    const { router } = renderRoute({ initialPath: "/login", token: "t" })
    await waitFor(() => expect(router.state.location.pathname).toBe("/"))
  })
})

describe("Login form", () => {
  it("validates email format and password length before submitting", async () => {
    let hit = false
    server.use(
      http.post(api("/login/access-token"), () => {
        hit = true
        return HttpResponse.json({ access_token: "x", token_type: "bearer" })
      }),
    )
    renderRoute({ initialPath: "/login", token: null })
    await screen.findByRole("heading", { name: /login to your account/i })

    await userEvent.type(screen.getByTestId("email-input"), "not-an-email")
    await userEvent.type(screen.getByTestId("password-input"), "short")
    await userEvent.click(screen.getByRole("button", { name: /log in/i }))

    expect(
      await screen.findByText(/at least 8 characters/i),
    ).toBeInTheDocument()
    expect(hit).toBe(false)
  })

  it("logs in, stores the token, and navigates home on success", async () => {
    server.use(
      http.post(api("/login/access-token"), () =>
        HttpResponse.json({ access_token: "real-token", token_type: "bearer" }),
      ),
    )
    const { router } = renderRoute({ initialPath: "/login", token: null })
    await screen.findByRole("heading", { name: /login to your account/i })

    await userEvent.type(screen.getByTestId("email-input"), "user@example.com")
    await userEvent.type(screen.getByTestId("password-input"), "password123")
    await userEvent.click(screen.getByRole("button", { name: /log in/i }))

    await waitFor(() =>
      expect(localStorage.getItem("access_token")).toBe("real-token"),
    )
    await waitFor(() => expect(router.state.location.pathname).toBe("/"))
  })

  it("surfaces a server error and stays on the login page", async () => {
    server.use(
      http.post(api("/login/access-token"), () =>
        HttpResponse.json(
          { detail: "Incorrect email or password" },
          {
            status: 400,
          },
        ),
      ),
    )
    const { router } = renderRoute({ initialPath: "/login", token: null })
    await screen.findByRole("heading", { name: /login to your account/i })

    await userEvent.type(screen.getByTestId("email-input"), "user@example.com")
    await userEvent.type(screen.getByTestId("password-input"), "password123")
    await userEvent.click(screen.getByRole("button", { name: /log in/i }))

    // No token stored and still on /login.
    await waitFor(() => expect(router.state.location.pathname).toBe("/login"))
    expect(localStorage.getItem("access_token")).toBeNull()
  })
})

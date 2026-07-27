import { HttpResponse, http } from "msw"

// Must match OpenAPI.BASE set in tests/setup.ts.
export const API = "http://localhost:8001"
export const api = (path: string) => `${API}/api/v1${path}`

// Default happy-path handlers. Individual tests override with server.use(...).
export const handlers = [
  // ---- Auth -----------------------------------------------------------------
  http.post(api("/login/access-token"), () =>
    HttpResponse.json({ access_token: "test-token", token_type: "bearer" }),
  ),
  http.get(api("/users/me"), () =>
    HttpResponse.json({
      id: "u1",
      email: "student@example.com",
      full_name: "Test Student",
      is_active: true,
      is_superuser: false,
      role: "student",
    }),
  ),
  http.post(api("/users/signup"), () =>
    HttpResponse.json({
      id: "u2",
      email: "new@example.com",
      full_name: "New User",
      is_active: true,
      is_superuser: false,
      role: "student",
    }),
  ),

  // ---- Student assessment ---------------------------------------------------
  http.get(api("/student/enrolled_courses/quiz/:courseTitle/:quizId"), () =>
    HttpResponse.json({}),
  ),
  http.post(
    api("/student/enrolled_courses/quiz/:courseTitle/:quizId/submit"),
    () => HttpResponse.json({ ok: true }),
  ),
  http.get(api("/student/enrolled_courses/test/:courseTitle/:testId"), () =>
    HttpResponse.json({}),
  ),
  http.post(api("/student/enrolled_courses/test/:courseTitle/:testId"), () =>
    HttpResponse.json({ ok: true }),
  ),
  http.post(
    api("/student/enrolled_courses/test/:courseTitle/:testId/submit"),
    () => HttpResponse.json({ ok: true }),
  ),
]

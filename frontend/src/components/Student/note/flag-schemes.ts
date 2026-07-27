// Color flags for note sections. Flag 0 means "no flag".
// Mirrors the old FLAG_SCHEMES (1 red, 2 purple, 3 green, 4 blue, 5 yellow).
export interface FlagScheme {
  value: number
  label: string
  dot: string
  border: string
  badge: string
  // Left accent rail shown on a flagged block.
  rail: string
}

export const FLAG_SCHEMES: FlagScheme[] = [
  {
    value: 1,
    label: "Red",
    dot: "bg-red-500",
    border: "border-red-500/60",
    badge: "border-red-500/40 text-red-600 dark:text-red-400",
    rail: "bg-red-500",
  },
  {
    value: 2,
    label: "Purple",
    dot: "bg-purple-500",
    border: "border-purple-500/60",
    badge: "border-purple-500/40 text-purple-600 dark:text-purple-400",
    rail: "bg-purple-500",
  },
  {
    value: 3,
    label: "Green",
    dot: "bg-green-500",
    border: "border-green-500/60",
    badge: "border-green-500/40 text-green-600 dark:text-green-400",
    rail: "bg-green-500",
  },
  {
    value: 4,
    label: "Blue",
    dot: "bg-blue-500",
    border: "border-blue-500/60",
    badge: "border-blue-500/40 text-blue-600 dark:text-blue-400",
    rail: "bg-blue-500",
  },
  {
    value: 5,
    label: "Yellow",
    dot: "bg-yellow-500",
    border: "border-yellow-500/60",
    badge: "border-yellow-500/40 text-yellow-600 dark:text-yellow-400",
    rail: "bg-yellow-500",
  },
]

export const flagBorder = (flag: number): string =>
  FLAG_SCHEMES.find((f) => f.value === flag)?.border ?? "border-border"

export const flagRail = (flag: number): string =>
  FLAG_SCHEMES.find((f) => f.value === flag)?.rail ?? ""

export const flagScheme = (flag: number): FlagScheme | undefined =>
  FLAG_SCHEMES.find((f) => f.value === flag)

// Build a full image URL from the stored filename returned by the upload endpoint.
export const imageUrl = (filename: string): string =>
  `${import.meta.env.VITE_API_URL}/api/v1/images/show/${filename}`

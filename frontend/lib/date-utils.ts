// Simple date utility functions to replace date-fns dependency
export function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return options?.addSuffix ? "just now" : "now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    const suffix = options?.addSuffix ? " ago" : ""
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"}${suffix}`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    const suffix = options?.addSuffix ? " ago" : ""
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"}${suffix}`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    const suffix = options?.addSuffix ? " ago" : ""
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"}${suffix}`
  }

  const suffix = options?.addSuffix ? " ago" : ""
  return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) === 1 ? "" : "s"}${suffix}`
}

export function formatExactTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

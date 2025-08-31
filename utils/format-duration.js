export function formatDuration(seconds) {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} min ${remainingSeconds} sec`
  } else {
    return `${seconds} sec`
  }
}
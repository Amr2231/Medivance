export function formatSlotTime(value: string) {
  return String(value).slice(0, 5);
}

export function confidenceWidth(score: number) {
  return `${Math.min(100, Math.max(0, score))}%`;
}

const NO_DATA_COLOR = "#d7dce1";

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function getScoreColor(score: number | null): string {
  return score === null ? NO_DATA_COLOR : `hsl(${clamp(score) * 120} 72% 42%)`;
}

export function getConfidenceColor(confidence: number | null): string {
  if (confidence === null) return NO_DATA_COLOR;

  const lightness = 88 - clamp(confidence) * 70;
  return `hsl(210 12% ${lightness}%)`;
}

import {
  getConfidenceColor,
  getScoreColor,
} from "@/features/stations/stationColors";
import { describe, expect, test } from "vitest";

describe("station colors", () => {
  test.each([
    [null, "#d7dce1"],
    [-1, "hsl(0 72% 42%)"],
    [0.5, "hsl(60 72% 42%)"],
    [2, "hsl(120 72% 42%)"],
  ])("maps score %s to %s", (score, expected) => {
    expect(getScoreColor(score)).toBe(expected);
  });

  test.each([
    [null, "#d7dce1"],
    [-1, "hsl(210 12% 88%)"],
    [0.5, "hsl(210 12% 53%)"],
    [2, "hsl(210 12% 18%)"],
  ])("maps confidence %s to %s", (confidence, expected) => {
    expect(getConfidenceColor(confidence)).toBe(expected);
  });
});

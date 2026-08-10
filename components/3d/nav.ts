import type { NavTarget } from "./store";

/**
 * Canonical scroll/view cycle. Wheel + swipe navigation cycles this list
 * sequentially (clamped at the ends); arrow keys wrap around it.
 */
export const SEQUENCE: NavTarget[] = [
  "door",
  "entry",
  "wall",
  "overview",
  "tv",
  "laptop",
  "tablet",
  "phone",
];

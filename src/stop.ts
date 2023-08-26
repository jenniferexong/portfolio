import type { TrackPosition } from "./track";

export interface Stop {
  name: StopName;
  position: TrackPosition;
  next: Stop;
  previous: Stop;
}

export type StopName =
  | "aboutMe"
  | "bunnyGame"
  | "split"
  | "ribbleChat"
  | "workExperience"
  | "education"
  | "contact"
  | "controls";

export const createStop = (name: StopName, position: TrackPosition): Stop => ({
  name,
  position,
  next: undefined!,
  previous: undefined!,
});

/**
 * Link stops into a circular structure.
 */
export const linkStops = (stops: Stop[]) => {
  for (let i = 0; i < stops.length; i++) {
    // link first and last stops
    const previous = i == 0 ? stops.length - 1 : i - 1;
    const next = i == stops.length - 1 ? 0 : i + 1;
    stops[i].previous = stops[previous];
    stops[i].next = stops[next];
  }
};

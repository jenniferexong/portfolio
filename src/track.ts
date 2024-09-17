import { Stop, StopName, createStop, linkStops } from "./stop";

export interface Track {
  getStopLoc: (stop: StopName) => TrackPosition;
  getStop: (name: StopName) => Stop;
  calculateRoute: (start: TrackPosition, end: TrackPosition) => Route;
  getStopNames: () => string[];
}

type Route = {
  remainingDistance: number;
  direction: Direction;
};

export enum Direction {
  Forward = 1,
  Backward = -1,
  Stationary = 0,
}

export const START_POSITION = 9.5;

/**
 * Number from 0 - 10
 */
export type TrackPosition = number;

/**
 * Think of train track as a circle, where each stop is located at some point on the circumference.
 * Points on the circumference range from values in [0, length]
 */
export const createTrack = (): Track => {
  // length of the track in action.time steps
  const circumference = 10.0;
  const stops: { [key in StopName]: Stop } = {
    controls: createStop("controls", START_POSITION), // Used when user first enters the website - the 'controls' stop
    aboutMe: createStop("aboutMe", 1.6),
    bunnyGame: createStop("bunnyGame", 3.45),
    split: createStop("split", 4.68),
    ribbleChat: createStop("ribbleChat", 5.3),
    workExperience: createStop("workExperience", 6.04),
    education: createStop("education", 6.95),
    contact: createStop("contact", 8.19),
  };

  linkStops(Object.values(stops));

  /**
   * Calculates the shortest distance from one point on the circumference to another.
   * @returns Remaining distance to travel, and direction to travel
   */
  const calculateRoute = (
    currentPos: TrackPosition,
    targetPos: TrackPosition
  ): Route => {
    // find which direction is faster
    let diff = targetPos - currentPos;

    let direction;
    if (diff > 0) {
      direction = Direction.Forward;
    } else if (diff < 0) {
      direction = Direction.Backward;
    } else {
      direction = Direction.Stationary;
    }

    // get shortest distance between current location and
    // next stop's location
    let remainingDistance = Math.abs(diff);

    // other direction is shorter
    if (Math.abs(diff) > circumference / 2) {
      direction *= -1;
      remainingDistance = circumference - remainingDistance;
    }

    return {
      remainingDistance,
      direction,
    };
  };

  return {
    getStopLoc: (stop: StopName) => stops[stop].position,
    getStop: (name: StopName): Stop => stops[name],
    calculateRoute,
    getStopNames: () => Object.keys(stops),
  };
};

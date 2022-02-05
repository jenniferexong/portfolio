import { createStop } from "./stop.js";
import { linkStops } from "./stop.js";

export const Direction = { FORWARD: 1, BACKWARD: -1, STATIONARY: 0 };
export const START_POSITION = 9.5;

/**
 * Think of train track as a circle, where each stop is located
 * at some point on the circumference.
 * points on the circumference range from values in [0, length]
 */
export const createTrack = () => {
  // length of the track in action.time steps
  const circumference = 10.0;
  const stops = {
    aboutMe: createStop("aboutMe", 1.6),
    bunnyGame: createStop("bunnyGame", 3.45),
    ribbleChat: createStop("ribbleChat", 4.95),
    workExperience: createStop("workExperience", 5.98),
    education: createStop("education", 6.95),
    contact: createStop("contact", 8.19),
  };

  linkStops(Object.values(stops));

  // Used when user first enters the website - the controls 'stop'
  const controlsStop = createStop("controls", START_POSITION);
  controlsStop.next = stops.aboutMe;
  controlsStop.previous = stops.contact;

  /**
   * Calculates the shortest distance from one point on the circumference to another.
   * @param {float} currentPos
   * @param {float} targetPos
   * @returns Remaining distance to travel, and direction to travel
   */
  const calculateRoute = (currentPos, targetPos) => {
    // find which direction is faster
    let diff = targetPos - currentPos;

    let direction;
    if (diff > 0) {
      direction = Direction.FORWARD;
    } else if (diff < 0) {
      direction = Direction.BACKWARD;
    } else {
      direction = Direction.STATIONARY;
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
    getStopLoc: (stopName) => stops[stopName].location,
    getStop: (name) => (name === "controls" ? controlsStop : stops[name]),
    calculateRoute,
    getStopNames: () => Object.keys(stops),
  };
};

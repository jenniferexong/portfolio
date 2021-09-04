import { createStop } from "./stop.js";
import { linkStops } from "./stop.js";

/**
 * Think of train track as a circle, where each stop is located
 * at some point on the circumference.
 * points on the circumference range from values in [0, length]
 */
export const createTrack = () => {
  // length of the track in action.time steps
  const circumference = 10.0;
  const stops = {
    aboutMe: createStop("aboutMe", 1.65),
    bunnyGame: createStop("bunnyGame", 3.5),
    ribbleChat: createStop("ribbleChat", 4.95),
    workExperience: createStop("workExperience", 5.95),
    education: createStop("education", 6.95),
    contact: createStop("contact", 8.19),
  };

  linkStops(Object.values(stops));

  // Used when user first enters the website - the controls 'stop'
  const ghostStop = createStop("controls", 0);
  ghostStop.next = stops.aboutMe;
  ghostStop.previous = stops.contact;

  return {
    // keys are stop names, values are positions on circumference
    // names must match button ids
    getStopLoc: (stopName) => {
      return stops[stopName].location;
    },

    getStop: (name) => (name === "" ? ghostStop : stops[name]),

    // calculates the shortest distance from one point on the
    // circumference to another.
    calculateRoute: (currentPos, targetPos) => {
      // find which direction is faster
      let diff = targetPos - currentPos;

      let dir; // +ve means clockwise, -ve means anti, 0 means stationary
      if (diff > 0) {
        dir = 1;
      } else if (diff < 0) {
        dir = -1;
      } else {
        dir = 0;
      }

      // get shortest distance between current location and
      // next stop's location
      let distance = Math.abs(diff);

      // other direction is shorter
      if (Math.abs(diff) > circumference / 2) {
        dir *= -1;
        distance = circumference - distance;
      }

      return {
        remainingDist: distance,
        direction: dir,
      };
    },
  };
};

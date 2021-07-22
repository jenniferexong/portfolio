import CreateStop from "./Stop.js";
import { linkStops } from "./Stop.js";

// think of train track as a circle, where each stop is located
// at some point on the circumference.
// points on the circumference range from values in [0, length]

const CreateTrack = () => {
  // length of the track in action.time steps
  const circumference_ = 10.0;
  const stops_ = {
    aboutMe: CreateStop("aboutMe", 1.65),
    bunnyGame: CreateStop("bunnyGame", 3.5),
    ribbleChat: CreateStop("ribbleChat", 4.95),
    workHistory: CreateStop("workHistory", 5.95),
    education: CreateStop("education", 6.95),
    contact: CreateStop("contact", 8.19),
  };

  linkStops(Object.values(stops_));

  return {
    // keys are stop names, values are positions on circumference
    // names must match button ids
    getStationLoc: (stationName) => {
      return stops_[stationName].location();
    },

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
      if (Math.abs(diff) > circumference_ / 2) {
        dir *= -1;
        distance = circumference_ - distance;
      }

      return {
        remainingDist: distance,
        direction: dir,
      };
    },
  };
};

export default CreateTrack;

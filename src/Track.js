// think of train track as a circle, where each stop is located
// at some point on the circumference.
// points on the circumference range from values in [0, length]
const CreateTrack = () => {
  // length of the track in action.time steps
  const circumference_ = 10.0;
  const stops_ = {
    aboutMe: 1.65,
    bunnyGame: 3.5,
    ribbleChat: 4.95,
    workHistory: 5.95,
    education: 6.95,
    contact: 8.19,
  };

  return {
    // keys are stop names, values are positions on circumference
    // names must match button ids
    getStationLoc: (stationName) => {
      return stops_[stationName];
    },

    // calculates the shortest distance from one point on the
    // circumference to another.
    calculateRoute: (currentPos, targetStop) => {
      // find which direction is faster
      let targetPos = stops_[targetStop];
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
      console.log(distance);

      return {
        remainingDist: distance,
        direction: dir,
      };
    },
  };
};

export default CreateTrack;

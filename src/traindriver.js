import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils";
import { createTrack } from "./track.js";

const MAX_SPEED = 0.7;
const RANGE = 0.2;
const ACCELERATION = 1.1;
const START_POSITION = 9.5;

export const createTrainDriver = (train) => {
  const track = createTrack();

  const stopManager = {
    currentStop: "",
    previousStop: "",
    hoveredStop: "aboutMe",
    previousHoveredStop: "aboutMe",
    targetStop: "",
  };

  let route = {
    remainingDist: 100,
    direction: 0,
  };

  let speed = 0;
  let direction = 1;
  let acceleration = 0;

  // set initial position of train
  train.setTime(START_POSITION);
  train.setSpeed(0);

  /**
   *
   * @param {String} stopName Stop to lock in
   */
  const setTargetStop = (stopName) => {
    if (stopName === stopManager.currentStop) return;

    stopManager.targetStop = stopName;

    // get route to next stop
    route = track.calculateRoute(
      train.getCurrentTime(),
      track.getStopLoc(stopManager.targetStop)
    );

    speed = MAX_SPEED;
    acceleration = 0;
    direction = route.direction;
  };

  const ponderNextStop = () => {
    stopManager.previousHoveredStop = stopManager.hoveredStop;
    stopManager.hoveredStop = track.getStop(stopManager.hoveredStop).next.name;
  };

  const ponderPreviousStop = () => {
    stopManager.previousHoveredStop = stopManager.hoveredStop;
    stopManager.hoveredStop = track.getStop(
      stopManager.hoveredStop
    ).previous.name;
  };

  const driveTrain = (delta) => {
    speed += acceleration * delta;
    speed = clamp(speed, 0, MAX_SPEED);

    train.setSpeed(speed * direction);
    train.update(delta);

    // check for overshooting stop
    route.remainingDist -= Math.abs(delta * speed);

    if (route.remainingDist < RANGE) {
      acceleration = -ACCELERATION;
    }

    // End the journey to the target stop
    if (stopManager.currentStop == stopManager.targetStop) {
      stopManager.currentStop = stopManager.targetStop;
      return;
    }

    // the current stop
    const stop = track.getStop(stopManager.currentStop);

    // check for current stop
    // check previous and next stop distance
    let distNext = track.calculateRoute(
      train.getCurrentTime(),
      stop.next.location
    ).remainingDist;

    let distPrev = track.calculateRoute(
      train.getCurrentTime(),
      stop.previous.location
    ).remainingDist;

    if (distNext < RANGE) {
      stopManager.previousStop = stopManager.currentStop;
      stopManager.currentStop = stop.next.name;
    } else if (distPrev < RANGE) {
      stopManager.previousStop = stopManager.currentStop;
      stopManager.currentStop = stop.previous.name;
    }
  };

  return {
    stopManager,

    position: () => mesh.position,
    update: driveTrain,
    setTargetStop,
    ponderNextStop,
    ponderPreviousStop,

    // set hovered stop as target
    lockInStop: () => setTargetStop(stopManager.hoveredStop),
  };
};

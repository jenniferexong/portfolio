import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils";
import { createTrack } from "./track.js";

export const Direction = { FORWARD: 1, BACKWARD: -1, STATIONARY: 0 };

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

  let remainingDistance = 100;

  let speed = 0;
  let direction = Direction.FORWARD;
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
    const route = track.calculateRoute(
      train.getCurrentTime(),
      track.getStopLoc(stopManager.targetStop)
    );

    // if change of direction, reset speed
    if (direction !== route.direction) speed = 0;
    acceleration = ACCELERATION;
    direction = route.direction;
    remainingDistance = route.remainingDistance;
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

  const driveInDirection = (newDirection) => {
    stopManager.targetStop = "";

    // if change of direction, reset speed
    if (newDirection !== direction) speed = 0;

    acceleration = ACCELERATION;
    direction = newDirection;
  };

  const releasePedal = () => {
    acceleration = -ACCELERATION;
  };

  const driveTrain = (delta) => {
    speed += acceleration * delta;
    speed = clamp(speed, 0, MAX_SPEED);

    train.setSpeed(speed * direction);
    train.update(delta);

    if (stopManager.targetStop !== "") {
      // check for overshooting target stop
      remainingDistance -= Math.abs(delta * speed);

      if (remainingDistance < RANGE) {
        acceleration = -ACCELERATION;
      }
    }

    // the current stop
    const stop = track.getStop(stopManager.currentStop);

    // check for current stop
    // check previous and next stop distance
    let distNext = track.calculateRoute(
      train.getCurrentTime(),
      stop.next.location
    ).remainingDistance;

    let distPrev = track.calculateRoute(
      train.getCurrentTime(),
      stop.previous.location
    ).remainingDistance;

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
    driveInDirection,
    releasePedal,

    // set hovered stop as target
    lockInStop: () => setTargetStop(stopManager.hoveredStop),
  };
};

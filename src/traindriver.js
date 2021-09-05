import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils";
import { createTrack } from "./track.js";

export const Direction = { FORWARD: 1, BACKWARD: -1, STATIONARY: 0 };

const MAX_SPEED = 0.7;
const DECELERATION_RANGE = 0.25;
const STOP_RANGE = 0.05;
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

  let remainingDistance = 0;

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
    stopManager.targetStop = stopName;

    // get route to next stop
    const route = track.calculateRoute(
      train.getCurrentTime(),
      track.getStopLoc(stopManager.targetStop)
    );

    if (route.remainingDistance < STOP_RANGE) {
      setArrived();
      return;
    }

    // if change of direction, reset speed
    if (direction !== route.direction) speed = 0;
    if (route.remainingDistance < DECELERATION_RANGE) speed = MAX_SPEED / 3;

    acceleration = ACCELERATION;
    direction = route.direction;
    remainingDistance = route.remainingDistance;
    console.log(remainingDistance);
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
    remainingDistance = 0;

    // if change of direction, reset speed
    if (newDirection !== direction) speed = 0;

    acceleration = ACCELERATION;
    direction = newDirection;
  };

  const releasePedal = () => {
    acceleration = -ACCELERATION;
  };

  /**
   * Removes target stop and remaining distance, but lets train come
   * to a stop by itself
   */
  const setArrived = () => {
    remainingDistance = 0;
    stopManager.targetStop = "";
  };

  const driveTrain = (delta) => {
    // update train position based on current speed and acceleration
    speed += acceleration * delta;
    speed = clamp(speed, 0, MAX_SPEED);

    train.setSpeed(speed * direction);
    train.update(delta);

    // If moving to a determined target, decrement remaining distance
    if (stopManager.targetStop !== "") {
      // Close to stop, but not there within 0.1 raage
      if (remainingDistance < STOP_RANGE) {
        setArrived();
      } else if (remainingDistance < DECELERATION_RANGE) {
        // deceleration needed to come to a stop after travelling remaining distance
        acceleration = -Math.pow(speed, 2) / (remainingDistance * 2);
      }

      remainingDistance -= Math.abs(delta * speed);
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

    if (distNext < DECELERATION_RANGE) {
      stopManager.previousStop = stopManager.currentStop;
      stopManager.currentStop = stop.next.name;
    } else if (distPrev < DECELERATION_RANGE) {
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

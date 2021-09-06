import * as THREE from "three";
import { clamp } from "three/src/math/MathUtils";
import { createTrack } from "./track.js";
import { Direction, START_POSITION } from "./track.js";
import { updateButtons } from "./view.js";

const MAX_SPEED = 0.7;
const DECELERATION_RANGE = 0.25;
const STOP_RANGE = 0.05;
const RANGE = 0.1;
const ACCELERATION = 1.1;

export const createTrainDriver = (train) => {
  const track = createTrack();
  const stopInfo = {
    lastVisited: "controls",
    currentStop: "",
    hoveredStop: "aboutMe",
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
    stopInfo.targetStop = stopName;

    // get route to next stop
    const route = track.calculateRoute(
      train.getCurrentTime(),
      track.getStopLoc(stopInfo.targetStop)
    );

    if (route.remainingDistance < STOP_RANGE) {
      removeRoute();
      return;
    }

    // if change of direction, reset speed
    if (direction !== route.direction) speed = 0;
    if (route.remainingDistance < DECELERATION_RANGE) speed = MAX_SPEED / 3;

    acceleration = ACCELERATION;
    direction = route.direction;
    remainingDistance = route.remainingDistance;
  };

  const ponderNextStop = () => {
    stopInfo.hoveredStop = track.getStop(stopInfo.hoveredStop).next.name;
  };

  const ponderPreviousStop = () => {
    stopInfo.hoveredStop = track.getStop(stopInfo.hoveredStop).previous.name;
  };

  const driveInDirection = (newDirection) => {
    removeRoute();

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
  const removeRoute = () => {
    remainingDistance = 0;
    stopInfo.targetStop = "";
  };

  const driveTrain = (delta) => {
    // update train position based on current speed and acceleration
    speed += acceleration * delta;
    speed = clamp(speed, 0, MAX_SPEED);

    train.setSpeed(speed * direction);
    train.update(delta);

    // If moving to a determined target, decrement remaining distance
    if (stopInfo.targetStop !== "") {
      // About to arrive to stop
      if (remainingDistance < STOP_RANGE) {
        removeRoute();
      } else if (remainingDistance < DECELERATION_RANGE) {
        // deceleration needed to come to a stop after travelling remaining distance
        acceleration = -Math.pow(speed, 2) / (remainingDistance * 2);
      }

      remainingDistance -= Math.abs(delta * speed);
    }

    setLastVisited();
  };

  /**
   * Checks if the train is near a stop
   */
  const setLastVisited = () => {
    // the current stop
    const stop = track.getStop(stopInfo.lastVisited);

    // distance to stop that was last visited
    let dist = track.calculateRoute(
      train.getCurrentTime(),
      stop.location
    ).remainingDistance;

    // distance to the stop after last visited
    let distNext = track.calculateRoute(
      train.getCurrentTime(),
      stop.next.location
    ).remainingDistance;

    // distance to the stop before last visited
    let distPrev = track.calculateRoute(
      train.getCurrentTime(),
      stop.previous.location
    ).remainingDistance;

    if (dist < RANGE) {
      stopInfo.lastVisited = stop.name;
      stopInfo.currentStop = stop.name;
    } else if (distNext < RANGE) {
      stopInfo.lastVisited = stop.next.name;
      stopInfo.currentStop = stop.next.name;
    } else if (distPrev < RANGE) {
      stopInfo.lastVisited = stop.previous.name;
      stopInfo.currentStop = stop.previous.name;
    } else {
      // not close to any stop
      stopInfo.currentStop = "";
    }
  };

  return {
    stopInfo,
    track,

    position: () => mesh.position,
    update: driveTrain,
    setTargetStop,
    ponderNextStop,
    ponderPreviousStop,
    driveInDirection,
    releasePedal,

    // set hovered stop as target
    lockInStop: () => setTargetStop(stopInfo.hoveredStop),
  };
};

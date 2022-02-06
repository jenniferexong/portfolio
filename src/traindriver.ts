import { clamp } from "three/src/math/MathUtils";

import { Train } from "./train";
import { StopName } from "stop";
import { createTrack, Direction, START_POSITION, Track } from "./track";

const MAX_SPEED = 0.7;
const DECELERATION_RANGE = 0.25;
const STOP_RANGE = 0.05;
const RANGE = 0.1;
const ACCELERATION = 1.1;

type StopInfo = {
  lastVisited: StopName;
  hoveredStop: StopName;
  currentStop?: StopName;
  targetStop?: StopName;
};

export type TrainDriver = {
  stopInfo: StopInfo;
  track: Track;
  update(delta: number): void;
  setTargetStop(stopName: StopName): void;
  ponderNextStop(): void;
  ponderPreviousStop(): void;
  driveInDirection(direction: Direction): void;
  releasePedal(): void;

  // set hovered stop as target
  lockInStop(): void;
};

export const createTrainDriver = (train: Train): TrainDriver => {
  const track = createTrack();

  const stopInfo: StopInfo = {
    lastVisited: "controls",
    currentStop: undefined,
    hoveredStop: "aboutMe",
    targetStop: undefined,
  };

  let remainingDistance = 0;

  let speed = 0;
  let direction = Direction.Forward;
  let acceleration = 0;

  // set initial position of train
  train.setPosition(START_POSITION);
  train.setSpeed(0);

  /**
   *
   * @param {String} stopName Stop to lock in
   */
  const setTargetStop = (stop: StopName) => {
    stopInfo.targetStop = stop;

    // get route to next stop
    const route = track.calculateRoute(
      train.getCurrentPosition(),
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

  const driveInDirection = (newDirection: Direction) => {
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
    stopInfo.targetStop = undefined;
  };

  const driveTrain = (delta: number) => {
    // update train position based on current speed and acceleration
    speed += acceleration * delta;
    speed = clamp(speed, 0, MAX_SPEED);

    train.setSpeed(speed * direction);
    train.update(delta);

    // If moving to a determined target, decrement remaining distance
    if (stopInfo.targetStop) {
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
      train.getCurrentPosition(),
      stop.position
    ).remainingDistance;

    // distance to the stop after last visited
    let distNext = track.calculateRoute(
      train.getCurrentPosition(),
      stop.next.position
    ).remainingDistance;

    // distance to the stop before last visited
    let distPrev = track.calculateRoute(
      train.getCurrentPosition(),
      stop.previous.position
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
      stopInfo.currentStop = undefined;
    }
  };

  return {
    stopInfo,
    track,

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

import * as THREE from "three";
import { createTrack } from "./track.js";

const MAX_SPEED = 1.3;

export const createTrain = (gltf, meshName, actionName) => {
  const mesh = gltf.scene.children.find((child) => child.name === meshName);
  if (mesh == undefined) {
    console.log("train mesh not found:", meshName);
  }

  // starting stop
  const track = createTrack();
  let targetStop = "aboutMe";
  let route = {
    remainingDist: 0,
    direction: 0,
  };

  // train animation
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  const trainClip = THREE.AnimationClip.findByName(clips, actionName);
  if (trainClip == undefined) {
    console.log("train action not found:", actionName);
  }

  // init to stationary
  const action = mixer.clipAction(trainClip);
  action.timeScale = 0;
  action.time = track.getStationLoc("aboutMe");

  // start animation
  action.play();
  let speed = 0;

  return {
    mesh,
    action,
    track,

    position: () => mesh.position,

    setTargetStop: (stopName) => {
      console.log("next stop:", stopName);
      // deselect previous button
      document.getElementById(targetStop).classList.remove("selected");

      // select target stop buttonf:w
      targetStop = stopName;
      document.getElementById(targetStop).classList.add("selected");

      // get route to next stop
      route = track.calculateRoute(
        action.time,
        track.getStationLoc(targetStop)
      );
      // todo add acceleration
      speed = route.direction * MAX_SPEED;
    },

    update: (delta) => {
      action.timeScale = speed;
      if (mixer) mixer.update(delta);

      // check for overshooting stop
      route.remainingDist -= Math.abs(delta * speed);

      if (route.remainingDist < 0) {
        action.time = track.getStationLoc(targetStop);
        speed = 0;
      }
    },
  };
};

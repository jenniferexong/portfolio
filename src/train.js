import * as THREE from "three";
import { renderScene } from "./view";

export const createTrain = (gltf, meshName, actionName) => {
  const mesh = gltf.scene.children.find((child) => child.name === meshName);
  if (mesh == undefined) {
    console.log("train mesh not found:", meshName);
  }

  // train animation
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  const trainClip = THREE.AnimationClip.findByName(clips, actionName);
  if (trainClip == undefined) {
    console.log("train action not found:", actionName);
  }

  const action = mixer.clipAction(trainClip);

  // start animation
  action.play();

  const setSpeed = (speed) => {
    action.timeScale = speed;
  };

  const update = (delta) => {
    if (mixer) {
      mixer.update(delta);
      if (action.timeScale !== 0) renderScene();
    }
  };

  const setTime = (time) => {
    action.time = time;
  };

  return {
    mesh,
    action,

    position: () => mesh.position,
    getCurrentTime: () => action.time,
    setTime,
    update,
    setSpeed,
  };
};

import * as THREE from "three";
import { AnimationAction, Mesh, Object3D } from "three";

import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { TrackPosition } from "./track";
import { renderScene, updateButtons } from "./view";

export interface Train {
  mesh: Mesh;
  action: AnimationAction;

  coordinates(): THREE.Vector3;
  getCurrentPosition(): number;
  setPosition(position: TrackPosition): void;
  setSpeed(speed: number): void;
  update(delta: number): void;
}

export const createTrain = (
  gltf: GLTF,
  meshName: string,
  actionName: string
): Train => {
  const mesh: Object3D | undefined = gltf.scene.children.find(
    (child) => child.name === meshName
  );

  if (!mesh) throw new Error(`train mesh not found: ${meshName}`);
  if (!(mesh instanceof Mesh)) throw new Error("train is not a mesh");

  // train animation
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  const trainClip = THREE.AnimationClip.findByName(clips, actionName);

  if (!trainClip) throw new Error(`train action not found: ${actionName}`);

  const action = mixer.clipAction(trainClip);

  // start animation
  action.play();

  const setSpeed = (speed: number) => {
    action.timeScale = speed;
  };

  const update = (delta: number) => {
    if (mixer) {
      if (action.timeScale !== 0) {
        renderScene();
        updateButtons();
      }

      mixer.update(delta);
    }
  };

  const setPosition = (time: number) => {
    action.time = time;
  };

  return {
    mesh: mesh as Mesh,
    action,

    coordinates: () => mesh.position,
    getCurrentPosition: () => action.time,
    setPosition,
    update,
    setSpeed,
  };
};

import * as Three from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

import { TrackPosition } from "./track";
import { renderScene, updateButtons } from "./view";

export interface Train {
  mesh: Three.Mesh;
  action: Three.AnimationAction;
  getCoordinates: () => Three.Vector3;
  getCurrentPosition: () => TrackPosition;
  setPosition: (position: TrackPosition) => void;
  setSpeed: (speed: number) => void;
  update: (delta: number) => void;
}

const TRAIN_MESH_NAME = "train";
const TRAIN_ACTION_NAME = "trainAction";

export const createTrain = (gltf: GLTF): Train => {
  const mesh: Three.Object3D | undefined = gltf.scene.children.find(
    (child) => child.name === TRAIN_MESH_NAME
  );

  if (!mesh) throw new Error(`train mesh not found: ${TRAIN_MESH_NAME}`);
  if (!(mesh instanceof Three.Mesh)) throw new Error("train is not a mesh");

  // train animation
  const mixer = new Three.AnimationMixer(gltf.scene);
  const clips = gltf.animations;
  const trainClip = Three.AnimationClip.findByName(clips, TRAIN_ACTION_NAME);

  if (!trainClip)
    throw new Error(`train action not found: ${TRAIN_ACTION_NAME}`);

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
    mesh,
    action,

    getCoordinates: () => mesh.position,
    getCurrentPosition: () => action.time,
    setPosition,
    update,
    setSpeed,
  };
};

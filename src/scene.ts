import * as THREE from "three";
import { createTrain } from "./train";
import { createTrainDriver, TrainDriver } from "./traindriver";
import { loadGltf } from "./loader";
import {
  initInteractables,
  InteractableData,
  Interactables,
} from "./interactable";
import { Mesh, Object3D, Vector3 } from "three";
import { StopName } from "./stop";

export interface Scene {
  interactableData: InteractableData;
  interactables: Interactables;
  trainDriver: TrainDriver;
  add(elem: Object3D): void;
  selectStop(stopName: StopName): void;
  getScene(): THREE.Scene;
  update(delta: number): void;
  getTrainCoords(): Vector3;
}

export const createScene = async (gltfUrl: string): Promise<Scene> => {
  const scene = new THREE.Scene();

  // background and fog
  const skyColor = "#77cacf";
  const near = 15;
  const far = 50;
  scene.fog = new THREE.Fog(skyColor, near, far);
  scene.background = new THREE.Color(skyColor);

  // lighting
  const hemisphere = new THREE.HemisphereLight("white", "black", 0.2);
  const ambient = new THREE.AmbientLight("white", 0.1);
  scene.add(ambient);
  const sun = new THREE.PointLight("#e8dba8", 1);
  sun.position.set(0, 20, 10);
  sun.castShadow = true;
  sun.shadow.bias = -0.0005;
  sun.shadow.mapSize.width = 1024 * 3;
  sun.shadow.radius = 3;
  sun.shadow.mapSize.height = 1024 * 3;
  scene.add(sun);
  scene.add(hemisphere);

  // loads a scene from a gltf/glb file, setting shadows
  // const manager = new THREE.LoadingManager();
  // manager.onLoad = finishLoading;
  const gltf = await loadGltf(gltfUrl);
  scene.add(gltf.scene);

  const interactableData: InteractableData = new Map();
  const train = createTrain(gltf, "train", "trainAction");
  const trainDriver = createTrainDriver(train);

  gltf.scene.traverse((node) => {
    // shadows
    if (node instanceof Mesh) {
      node.frustumCulled = false;
      node.castShadow = true;
      node.receiveShadow = true;

      node.material.side = THREE.FrontSide; // back face culling

      // interactive objects
      if (node.name.startsWith("i_", 0)) {
        interactableData.set(node.name, node);
      }

      if (node.name === "pause_icon") {
        node.visible = false;
      }
    }
  });

  const screen = interactableData.get("i_video_screen");
  if (!screen) throw new Error('Mesh "i_video_screen" not found');

  screen.material.side = THREE.DoubleSide;
  const video = document.getElementById("demo") as HTMLVideoElement;
  const texture = new THREE.VideoTexture(video);
  texture.encoding = THREE.sRGBEncoding;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  video.addEventListener("loadeddata", (e) => {
    if (video.readyState >= 3) {
      screen.material = new THREE.MeshBasicMaterial({ map: texture });
      screen.material.side = THREE.DoubleSide;
    }
  });

  const interactables = initInteractables(interactableData);

  return {
    interactableData,
    interactables,
    trainDriver,
    add: (elem: Object3D) => scene.add(elem),
    selectStop: (stopName: StopName) => trainDriver.setTargetStop(stopName),
    getScene: () => scene,
    update: (delta: number) => trainDriver.update(delta),
    getTrainCoords: () => train.coordinates(),
  };
};

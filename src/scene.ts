import * as Three from "three";

import { StopName } from "./stop";
import { loadGltf } from "./loader";
import { createTrain } from "./train";
import { createTrainDriver, TrainDriver } from "./train-driver";
import {
  createInteractables,
  InteractableData,
  Interactables,
} from "./interactable";

export interface Scene {
  interactableData: InteractableData;
  interactables: Interactables;
  trainDriver: TrainDriver;
  add: (elem: Three.Object3D) => void;
  selectStop: (stopName: StopName) => void;
  getScene: () => Three.Scene;
  update: (delta: number) => void;
  getTrainCoords: () => Three.Vector3;
}

const setupAtmosphere = (scene: Three.Scene) => {
  // background and fog
  const skyColor = "#77cacf";
  const near = 15;
  const far = 50;
  scene.fog = new Three.Fog(skyColor, near, far);
  scene.background = new Three.Color(skyColor);

  // lighting
  const hemisphere = new Three.HemisphereLight("white", "black", 0.2);
  const ambient = new Three.AmbientLight("white", 0.1);
  scene.add(ambient);
  const sun = new Three.PointLight("#e8dba8", 1);
  sun.position.set(0, 20, 10);
  sun.castShadow = true;
  sun.shadow.bias = -0.0005;
  sun.shadow.mapSize.width = 1024 * 3;
  sun.shadow.radius = 3;
  sun.shadow.mapSize.height = 1024 * 3;
  scene.add(sun);
  scene.add(hemisphere);
};

const setupVideo = (videoScreen: Three.Mesh<any, any>) => {
  videoScreen.material.side = Three.DoubleSide;
  const video = document.getElementById("demo") as HTMLVideoElement;
  const texture = new Three.VideoTexture(video);
  texture.encoding = Three.sRGBEncoding;
  texture.minFilter = Three.LinearFilter;
  texture.magFilter = Three.LinearFilter;

  video.addEventListener("loadeddata", () => {
    // Switch texture from thumbnail to video when video has loaded.
    if (video.readyState >= 3) {
      videoScreen.material = new Three.MeshBasicMaterial({ map: texture });
      videoScreen.material.side = Three.DoubleSide;
    }
  });
};

export const createScene = async (gltfUrl: string): Promise<Scene> => {
  const scene = new Three.Scene();

  setupAtmosphere(scene);

  const gltf = await loadGltf(gltfUrl);
  scene.add(gltf.scene);

  const interactableData: InteractableData = new Map();
  const train = createTrain(gltf);
  const trainDriver = createTrainDriver(train);

  gltf.scene.traverse((node) => {
    if (node instanceof Three.Mesh) {
      // shadows
      node.frustumCulled = false;
      node.castShadow = true;
      node.receiveShadow = true;

      node.material.side = Three.FrontSide; // back face culling

      // interactive objects
      if (node.name.startsWith("i_", 0)) {
        interactableData.set(node.name, node);
      }

      if (node.name === "i_pause_icon") {
        node.visible = false;
      }
    }
  });

  const videoScreen = interactableData.get("i_video_screen");
  if (!videoScreen) throw new Error('Mesh "i_video_screen" not found');

  setupVideo(videoScreen);

  const interactables = createInteractables(interactableData);

  return {
    interactableData,
    interactables,
    trainDriver,
    add: (elem: Three.Object3D) => scene.add(elem),
    selectStop: trainDriver.setTargetStop,
    getScene: () => scene,
    update: trainDriver.update,
    getTrainCoords: train.getCoordinates,
  };
};

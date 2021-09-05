import * as THREE from "three";
import { createTrain } from "./train.js";
import { createTrainDriver } from "./traindriver.js";
import { loadGltf } from "./loader.js";
import { initInteractables } from "./interactable.js";

export const createScene = async (gltfUrl) => {
  const scene = new THREE.Scene();

  // background and fog
  {
    const skyColor = "#77cacf";
    const near = 15;
    const far = 50;
    scene.fog = new THREE.Fog(skyColor, near, far);
    scene.background = new THREE.Color(skyColor);
  }

  // lighting
  {
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
  }

  // loads a scene from a gltf/glb file, setting shadows
  // const manager = new THREE.LoadingManager();
  // manager.onLoad = finishLoading;
  const gltf = await loadGltf(gltfUrl);
  scene.add(gltf.scene);

  const video = document.getElementById("demo");
  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const interactiveObjects = {};
  const train = createTrain(gltf, "train", "trainAction");
  const trainDriver = createTrainDriver(train);

  initObjects();
  function initObjects() {
    gltf.scene.traverse((node) => {
      // shadows
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        node.material.side = THREE.FrontSide; // back face culling

        // Set texture for video screen
        if (node.name === "video_screen") {
          node.material = new THREE.MeshBasicMaterial({ map: texture });
          node.material.side = THREE.DoubleSide;
        }

        // interactive objects
        if (node.name.startsWith("i_", 0)) {
          interactiveObjects[node.name] = node;
        }

        if (node.name === "pause_icon") {
          node.visible = false;
        }
      }
    });
  }

  const interactable = initInteractables(interactiveObjects);

  return {
    interactiveObjects, // Object3D
    interactable, // { mesh_name: interactable}
    trainDriver,
    add: (elem) => scene.add(elem),
    selectStop: (stopName) => trainDriver.setTargetStop(stopName),
    getScene: () => scene,
    update: (delta) => trainDriver.update(delta),
    getTrainPos: () => train.position(),
  };
};

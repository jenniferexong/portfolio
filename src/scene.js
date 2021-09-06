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

  const interactiveObjects = {};
  const train = createTrain(gltf, "train", "trainAction");
  const trainDriver = createTrainDriver(train);

  gltf.scene.traverse((node) => {
    // shadows
    if (node.isMesh) {
      node.frustumCulled = false;
      node.castShadow = true;
      node.receiveShadow = true;

      node.material.side = THREE.FrontSide; // back face culling

      // interactive objects
      if (node.name.startsWith("i_", 0)) {
        interactiveObjects[node.name] = node;
      }

      if (node.name === "pause_icon") {
        node.visible = false;
      }
    }
  });

  const screen = interactiveObjects["i_video_screen"];
  screen.material.side = THREE.DoubleSide;
  const video = document.getElementById("demo");
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

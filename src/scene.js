import * as THREE from "three";
import { createTrain } from "./train.js";
import { loadGltf } from "./loader.js";

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
    const hemisphere = new THREE.HemisphereLight("white", "black", 0.4);
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

  const video = document.getElementById("video");
  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const pickable = [];

  // set video texture
  initShadows();
  const train = createTrain(gltf, "train", "trainAction");

  // TODO rename
  function initShadows() {
    // set every mesh in gltf to cast and receive shadows
    gltf.scene.traverse((node) => {
      if (node.isMesh) {
        // interactive objects
        if (node.name.startsWith("i_", 0)) {
          console.log(node.name);
          pickable.push(node);
        }
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.side = THREE.FrontSide; // important

        if (node.name === "video_screen") {
          console.log("screen");
          node.material = new THREE.MeshBasicMaterial({ map: texture });
          node.material.side = THREE.DoubleSide;
        }
      }
    });
  }

  return {
    getPickable: () => pickable,
    add: (elem) => scene.add(elem),
    selectStop: (stopName) => train.setTargetStop(stopName),
    getScene: () => scene,
    update: (delta) => train.update(delta),
    getTrainPos: () => train.position(),
  };
};

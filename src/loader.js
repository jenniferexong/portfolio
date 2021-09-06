import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export async function loadGltf(url) {
  const manager = new THREE.LoadingManager();

  manager.onStart = () => {};

  manager.onLoad = () => {
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("outOfFocus").style.display = "flex";
  };

  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    let percent = ((itemsLoaded / 16) * 100) | 0;
    document.getElementById("loadingProgress").style.width = `${percent}%`;
  };

  // load the scene
  const loader = new GLTFLoader(manager);

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
  );
  loader.setDRACOLoader(dracoLoader);

  const gltf = await loader.loadAsync(url);

  if (!gltf) {
    console.log(`gltf loading error: ${url}`);
  }

  return gltf;
}

import * as Three from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export const loadGltf = async (url: string) => {
  const manager = new Three.LoadingManager();
  const progressBar = document.getElementById("loadingProgress");
  if (!progressBar) throw new Error("#loadingProgress not found");

  manager.onStart = () => {};

  manager.onLoad = () => {
    const loadingScreen = document.getElementById("loadingScreen");
    const outOfFocusOverlay = document.getElementById("outOfFocus");
    if (!loadingScreen) throw new Error("#loadingScreen not found");
    if (!outOfFocusOverlay) throw new Error("#outOfFocus not found");

    loadingScreen.style.display = "none";
    outOfFocusOverlay.style.display = "flex";
  };

  manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
    // For some reason the loader doesn't fill the entire way,
    // so hacking it with 106%
    let percent = ((itemsLoaded / itemsTotal) * 106) | 0;
    progressBar.style.width = `${percent}%`;
  };

  // load the scene
  const loader = new GLTFLoader(manager);

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/"
  );
  loader.setDRACOLoader(dracoLoader);

  const gltf = await loader.loadAsync(url);

  if (!gltf) throw new Error(`gltf loading error: ${url}`);

  return gltf;
};

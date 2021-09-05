import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { onLoad, onProgress } from "./UI.js";

export async function loadGltf(url) {
  // load the scene
  const loader = new GLTFLoader();

  const gltf = await loader.loadAsync(url, onProgress);
  onLoad();

  if (!gltf) {
    console.log(`gltf loading error: ${url}`);
  }
  console.log("loaded:", url);

  return gltf;
}

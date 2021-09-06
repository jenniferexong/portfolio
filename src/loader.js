import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { onLoad, onProgress } from "./UI.js";

export async function loadGltf(url) {
  // load the scene
  const loader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
  );
  loader.setDRACOLoader(dracoLoader);

  const gltf = await loader.loadAsync(url, onProgress);
  onLoad();

  if (!gltf) {
    console.log(`gltf loading error: ${url}`);
  }
  return gltf;
}

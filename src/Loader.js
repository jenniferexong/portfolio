import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

async function loadGltf(url) {
  // load the scene
  const loader = new GLTFLoader();

  const onProgress = (progressEvent) => {
    let percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
    console.log(`loaded: ${percent}%`);
  };

  const gltf = await loader.loadAsync(url, onProgress);

  if (!gltf) {
    console.log(`gltf loading error: ${url}`);
  }
  console.log("loaded:", url);

  return gltf;
}

export default loadGltf;

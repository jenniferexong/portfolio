import * as THREE from "three";
import { createScene } from "./scene.js";
import { createMousePicker } from "./mousepicker.js";
import { createView } from "./view.js";
import url from "../res/model/world.glb?url";

import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export const createApp = async () => {
  const clock = new THREE.Clock();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);

  // camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    45
  );
  camera.position.z = 5;
  camera.position.y = 2;
  camera.rotateY(3.3);

  // mouse control camera
  const controls = new PointerLockControls(camera, renderer.domElement);

  // wait for entire scene to load
  const scene = await createScene(url);
  const mousePicker = createMousePicker(camera, scene);
  const view = createView(camera, scene, renderer);

  function update() {
    requestAnimationFrame(update);
    // update scene
    scene.update(clock.getDelta());
    // update camera position
    const pos = scene.getTrainPos();
    camera.position.set(pos.x, pos.y + 0.5, pos.z);
  }

  return {
    renderer,
    camera,
    scene,
    controls,
    mousePicker,
    update,

    addToScene: (elem) => scene.add(elem),
  };
};

export default createApp;

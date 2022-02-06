import * as THREE from "three";
import { createScene } from "./scene";
import { createMousePicker } from "./mousepicker";
import { createView } from "./view";
import url from "./assets/model/world.glb?url";

import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Object3D } from "three";

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
  scene.add(controls.getObject());

  const mousePicker = createMousePicker(camera, scene);
  const view = createView(camera, scene, renderer);

  function update() {
    requestAnimationFrame(update);
    // update scene
    scene.update(clock.getDelta());
    // update camera position
    const pos = scene.getTrainCoords();
    camera.position.set(pos.x, pos.y + 0.5, pos.z);
  }

  return {
    renderer,
    camera,
    scene,
    controls,
    mousePicker,
    update,

    addToScene: (elem: Object3D) => scene.add(elem),
  };
};

export default createApp;

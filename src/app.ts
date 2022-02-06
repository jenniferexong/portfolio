import * as Three from "three";

import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

import { createScene, Scene } from "./scene";
import { createView } from "./view";
import { createMousePicker, MousePicker } from "./mousepicker";

import url from "./assets/model/world.glb?url";

export interface App {
  renderer: Three.Renderer;
  camera: Three.PerspectiveCamera;
  scene: Scene;
  controls: PointerLockControls;
  mousePicker: MousePicker;
  update(): void;
  addToScene(elem: Three.Object3D): void;
}

export const createApp = async (): Promise<App> => {
  const clock = new Three.Clock();
  const renderer = new Three.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = Three.PCFSoftShadowMap;
  renderer.outputEncoding = Three.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);

  // camera
  const camera = new Three.PerspectiveCamera(
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

    addToScene: (elem: Three.Object3D) => scene.add(elem),
  };
};

export default createApp;

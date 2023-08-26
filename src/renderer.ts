import * as Three from "three";

export const createRenderer = (): THREE.WebGLRenderer => {
  const renderer = new Three.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = Three.PCFSoftShadowMap;
  renderer.outputEncoding = Three.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);

  return renderer;
};

import * as THREE from "three";
import CreateScene from "./Scene.js";
import url from "./res/model/world.glb?url";

const CreateApp = async () => {
  const clock_ = new THREE.Clock();
  const renderer_ = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer_.setSize(window.innerWidth, window.innerHeight);
  renderer_.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer_.outputEncoding = THREE.sRGBEncoding;
  renderer_.setPixelRatio(window.devicePixelRatio);

  // camera
  const camera_ = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera_.position.z = 5;
  camera_.position.y = 2;
  camera_.rotateY(1.4);

  // wait for entire scene to load
  const scene_ = await CreateScene(url);

  function render() {
    requestAnimationFrame(render);
    // update scene
    scene_.update(clock_.getDelta());
    // update camera position
    const pos = scene_.getTrainPos();
    camera_.position.set(pos.x, pos.y + 0.5, pos.z);
    renderer_.render(scene_.getScene(), camera_);
  }

  return {
    renderer: renderer_,
    camera: camera_,
    scene: scene_,

    addToScene: (elem) => {
      scene_.add(elem);
    },
    render: () => {
      render();
    },
  };
};

export default CreateApp;

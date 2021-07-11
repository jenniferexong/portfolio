import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import CreateScene from "./Scene.js";

const CreateApp = async () => {
  const clock_ = new THREE.Clock();
  const renderer_ = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer_.setSize(window.innerWidth, window.innerHeight);
  renderer_.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer_.outputEncoding = THREE.sRGBEncoding;

  document.body.appendChild(renderer_.domElement);

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

  // window resize
  window.addEventListener("resize", onWindowResize, false);
  function onWindowResize() {
    camera_.aspect = window.innerWidth / window.innerHeight;
    camera_.updateProjectionMatrix();
    renderer_.setSize(window.innerWidth, window.innerHeight);
    render();
  }

  // mouse control camera
  const controls_ = new PointerLockControls(camera_, renderer_.domElement);
  const enterInstructions = document.getElementById("enter");
  const exitInstructions = document.getElementById("exit");

  renderer_.domElement.addEventListener("click", () => {
    controls_.lock();
  });

  controls_.addEventListener("lock", () => {
    //enterInstructions.style.display = "none";
    //exitInstructions.style.display = "block";
  });

  controls_.addEventListener("unlock", () => {
    //enterInstructions.style.display = "block";
    //exitInstructions.style.display = "none";
  });

  // select stop buttons
  {
    const buttons = document.getElementsByClassName("stopButtons");
    for (const button of buttons) {
      button.addEventListener("click", (e) => {
        scene_.selectStop(e.target.id);
      });
    }
  }

  function render() {
    requestAnimationFrame(render);
    // update scene
    scene_.update(clock_.getDelta());
    // update camera position
    const pos = scene_.getTrainPos();
    camera_.position.set(pos.x, pos.y + 0.5, pos.z);
    renderer_.render(scene_.getScene(), camera_);
  }

  const scene_ = await CreateScene("src/res/model/world.glb");

  return {
    addToScene: (elem) => {
      scene_.add(elem);
    },
    render: () => {
      render();
    },
  };
};

export default CreateApp;

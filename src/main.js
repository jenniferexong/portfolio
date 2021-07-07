import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

function render() {
  requestAnimationFrame(render);

  // update camera position and rotation
  var delta = clock.getDelta();
  if (mixer) mixer.update(delta / 3);

  camera.position.set(
    train.position.x,
    train.position.y + 0.5,
    train.position.z
  );

  renderer.render(scene, camera);
}

// setup
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2;
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// set background
scene.background = new THREE.Color("skyblue");

// sun (natural light)
const ambient = new THREE.AmbientLight("gray");
const light = new THREE.PointLight("white", 1.5, 100);
light.position.set(-2, 50, 20);
scene.add(light);
scene.add(ambient);

const controls = new PointerLockControls(camera, renderer.domElement);

renderer.domElement.addEventListener("click", function () {
  controls.lock();
});

const models = {
  world: { url: "src/res/model/world.gltf" },
};

const manager = new THREE.LoadingManager();
manager.onLoad = init;

function init() {
  // hide loading bar
  const loadingBar = document.querySelector("#loading");
  //loadingBar.style.display = "none";
}

const loader = new GLTFLoader(manager);
var train;
var mixer;
for (const model of Object.values(models)) {
  loader.load(model.url, (gltf) => {
    model.gltf = gltf;
    scene.add(gltf.scene);
    train = gltf.scene.children.find((child) => child.name === "train");
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  });
}

render();

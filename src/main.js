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
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// set background
scene.background = new THREE.Color("white");

// sun (natural light)
const hemisphere = new THREE.HemisphereLight("white", "#434343", 0.2);
const sun = new THREE.PointLight("white", 1);
sun.position.set(10, 20, 0);
sun.castShadow = true;
sun.shadow.bias = -0.0005;
sun.shadow.mapSize.width = 1024 * 3;
sun.shadow.radius = 3;
sun.shadow.mapSize.height = 1024 * 3;
scene.add(sun);
scene.add(hemisphere);

const controls = new PointerLockControls(camera, renderer.domElement);
const enterInstructions = document.getElementById("enter");
const exitInstructions = document.getElementById("exit");

renderer.domElement.addEventListener("click", () => {
  controls.lock();
});

controls.addEventListener("lock", () => {
  enterInstructions.style.display = "none";
  exitInstructions.style.display = "block";
});

controls.addEventListener("unlock", () => {
  enterInstructions.style.display = "block";
  exitInstructions.style.display = "none";
});

const models = {
  world: { url: "src/res/model/world.gltf" },
};

const manager = new THREE.LoadingManager();
manager.onLoad = init;

function init() {}

const loader = new GLTFLoader(manager);
var train;
var mixer;
for (const model of Object.values(models)) {
  loader.load(model.url, (gltf) => {
    model.gltf = gltf;
    train = gltf.scene.children.find((child) => child.name === "train");

    // ground receives shadows
    let ground = gltf.scene.children.find((child) => child.name === "ground");
    ground.receiveShadow = true;

    gltf.scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(gltf.scene);
    // all other objects in the scene cast shadows
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  });
}

// window resize
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

render();

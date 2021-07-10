import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

// setup
const clock = new THREE.Clock();
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
camera.position.y = 2;

// renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;

document.body.appendChild(renderer.domElement);

// window resize
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

// background and fog
{
  const skyColor = "#77cacf";
  const near = 15;
  const far = 50;
  scene.fog = new THREE.Fog(skyColor, near, far);
  scene.background = new THREE.Color(skyColor);
}

// lighting
{
  const hemisphere = new THREE.HemisphereLight("white", "black", 0.4);
  const ambient = new THREE.AmbientLight("white", 0.1);
  scene.add(ambient);
  const sun = new THREE.PointLight("#e8dba8", 1);
  sun.position.set(0, 20, 10);
  sun.castShadow = true;
  sun.shadow.bias = -0.0005;
  sun.shadow.mapSize.width = 1024 * 3;
  sun.shadow.radius = 3;
  sun.shadow.mapSize.height = 1024 * 3;
  scene.add(sun);
  scene.add(hemisphere);
}

// mouse controls
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

const world = { url: "src/res/model/world.glb", gltf: undefined };
const manager = new THREE.LoadingManager();
manager.onLoad = init;

// load the scene
const loader = new GLTFLoader(manager);
loader.load(world.url, (gltf) => {
  world.gltf = gltf;
  scene.add(gltf.scene);
});

// initialize shadows, animations
var mixer;
var train;
function init() {
  // cast and receive shadows
  world.gltf.scene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  train = world.gltf.scene.children.find((child) => child.name === "train");
  mixer = new THREE.AnimationMixer(world.gltf.scene);
  const clips = world.gltf.animations;
  const trainClip = clips[0];
  const trainAction = mixer.clipAction(trainClip);
  trainAction.play();

  render();
}

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

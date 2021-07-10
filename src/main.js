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
camera.rotateY(1.4);

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
  //enterInstructions.style.display = "none";
  //exitInstructions.style.display = "block";
});

controls.addEventListener("unlock", () => {
  //enterInstructions.style.display = "block";
  //exitInstructions.style.display = "none";
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
let mixer;
let train;
let trainAction;
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
  trainAction = mixer.clipAction(trainClip);
  trainAction.timeScale = 0;
  trainAction.play();

  setupKeyControls();
  render();
}

function render() {
  requestAnimationFrame(render);

  // update camera position and rotation
  update();
  renderer.render(scene, camera);
}

// arrow key controls (takes animationAction)
const pressedKeys = {
  up: false,
  down: false,
};

const timeLength = 1;
const stops = {
  aboutMe: 1.65,
  bunnyGame: 3.5,
  ribbleChat: 4.95,
  workHistory: 5.95,
  education: 6.95,
  contact: 8.19,
};

const maxSpeed = 1.3;
const deceleration = 0.8;
let speed = 0;
let acceleration = 0.8;
let distLeft = 0;

// select stop buttons
const buttons = document.getElementsByClassName("stopButtons");
for (const button of buttons) {
  button.addEventListener("click", (e) => {
    selectStop(e.target.id);
  });
}

let targetStop = "aboutMe";
function selectStop(stopName) {
  // deselect previous button
  document.getElementById(targetStop).classList.remove("selected");
  targetStop = stopName;
  document.getElementById(targetStop).classList.add("selected");

  // move train to new stop
  visitStop();
}

function visitStop() {
  // length of the track in action.time steps
  const circumference = 10.0;
  // think of train track as a circle, where each stop is located
  // at some point on the circumference.
  // points on the circumference range from values in [0, length]

  // find which direction is faster
  let previousPos = trainAction.time;
  let nextPos = stops[targetStop];
  let diff = nextPos - previousPos;
  let dir;
  if (diff > 0) dir = 1;
  else if (diff < 0) dir = -1;
  else dir = 0;

  // get shortest distance between current location and
  // next stop's location
  // (either anticlockwise or clockwise)
  distLeft = Math.abs(diff);

  // other direction is shorter
  if (Math.abs(diff) > circumference / 2) {
    dir *= -1;
    distLeft = circumference - distLeft;
  }
  console.log(distLeft);

  speed = dir * maxSpeed;
}

function update() {
  let delta = clock.getDelta();

  distLeft -= Math.abs(delta * speed);

  // overshooting stop
  if (distLeft < 0) {
    trainAction.time = stops[targetStop];
    speed = 0;
  }

  trainAction.timeScale = speed;
  if (mixer) mixer.update(delta);

  camera.position.set(
    train.position.x,
    train.position.y + 0.5,
    train.position.z
  );
}

function setupKeyControls() {
  document.onkeydown = (e) => {
    // up arrow or w
    if (e.key === "ArrowUp" || e.key === "w") {
      pressedKeys.up = true;
    }
    // down arrow or s
    if (e.key === "ArrowDown" || e.key === "s") {
      pressedKeys.down = true;
    }
  };
  document.onkeyup = (e) => {
    // up arrow or w
    if (e.key === "ArrowUp" || e.key === "w") {
      pressedKeys.up = false;
    }
    // down arrow or s
    if (e.key === "ArrowDown" || e.key === "s") {
      pressedKeys.down = false;
    }
  };
}

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

const maxSpeed = 1.3;
const deceleration = 0.8;
let speed = 0;
let acceleration = 0.8;

const stops = {
  aboutMe: 2.7,
  bunnyGame: 4.1,
  ribbleChat: 5.1,
  workHistory: 5.85,
  education: 6.56,
  contact: 7.55,
};

// select stop buttons
const buttons = document.getElementsByClassName("stopButtons");
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", (e) => {
    selectStop(e.target.id);
  });
}

let currentStop = "aboutMe";
function selectStop(stopName) {
  // deselect previous button
  document.getElementById(currentStop).classList.remove("selected");
  currentStop = stopName;
  document.getElementById(currentStop).classList.add("selected");
  // select new button
  console.log(stops[stopName]);
}

function update() {
  let delta = clock.getDelta();

  // control movement of train with arrow keys
  // accelerate forwards
  if (pressedKeys.up) {
    speed += acceleration * delta;
    if (speed > maxSpeed) speed = maxSpeed;
  }
  // accelerate backwards
  if (pressedKeys.down) {
    speed -= acceleration * delta;
    if (speed < -maxSpeed) speed = -maxSpeed;
  }
  // if none are pressed, decelerate towards a stop
  // i.e. speed == 0
  if (!pressedKeys.up && !pressedKeys.down) {
    // currently moving forwards
    if (speed > 0) {
      speed -= deceleration * delta;
      if (speed < 0) speed = 0;
    } else if (speed < 0) {
      // currently moving backwards
      speed += deceleration * delta;
      if (speed > 0) speed = 0;
    }
  }
  console.log(trainAction.time);

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

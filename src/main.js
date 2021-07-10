import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

const app = {
  clock: undefined,
  scene: undefined,
  renderer: undefined,
  controls: undefined,
  mixer: undefined,
};

const scene = {
  world: {
    url: "src/res/model/world.glb",
    gltf: undefined,
  },
  camera: undefined,
};

// arrow key controls (takes animationAction)
const pressedKeys = {
  up: false,
  down: false,
};

// think of train track as a circle, where each stop is located
// at some point on the circumference.
// points on the circumference range from values in [0, length]
const track = {
  // must match button ids
  stops: {
    aboutMe: 1.65,
    bunnyGame: 3.5,
    ribbleChat: 4.95,
    workHistory: 5.95,
    education: 6.95,
    contact: 8.19,
  },
  // length of the track in action.time steps
  circumference: 10.0,
};

const train = {
  mesh: undefined,
  distLeft: undefined, // distance left to travel
  targetStop: "aboutMe",
  action: undefined,
  speed: 0,
  maxSpeed: 1.3,
  acceleration: 1,
  deceleration: 1,
};

// animation actions
const actions = {};

function createApp() {
  // setup
  app.clock = new THREE.Clock();
  app.scene = new THREE.Scene();

  // renderer
  app.renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  app.renderer.setSize(window.innerWidth, window.innerHeight);
  app.renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  app.renderer.outputEncoding = THREE.sRGBEncoding;

  document.body.appendChild(app.renderer.domElement);

  // window resize
  window.addEventListener("resize", onWindowResize, false);

  // camera
  scene.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scene.camera.position.z = 5;
  scene.camera.position.y = 2;
  scene.camera.rotateY(1.4);

  // mouse controls
  app.controls = new PointerLockControls(scene.camera, app.renderer.domElement);
  const enterInstructions = document.getElementById("enter");
  const exitInstructions = document.getElementById("exit");

  app.renderer.domElement.addEventListener("click", () => {
    app.controls.lock();
  });

  app.controls.addEventListener("lock", () => {
    //enterInstructions.style.display = "none";
    //exitInstructions.style.display = "block";
  });

  app.controls.addEventListener("unlock", () => {
    //enterInstructions.style.display = "block";
    //exitInstructions.style.display = "none";
  });

  // select stop buttons
  const buttons = document.getElementsByClassName("stopButtons");
  for (const button of buttons) {
    button.addEventListener("click", (e) => {
      selectStop(e.target.id);
    });
  }
}

// lighting, sky, fog
function setupScene() {
  // background and fog
  {
    const skyColor = "#77cacf";
    const near = 15;
    const far = 50;
    app.scene.fog = new THREE.Fog(skyColor, near, far);
    app.scene.background = new THREE.Color(skyColor);
  }

  // lighting
  {
    const hemisphere = new THREE.HemisphereLight("white", "black", 0.4);
    const ambient = new THREE.AmbientLight("white", 0.1);
    app.scene.add(ambient);
    const sun = new THREE.PointLight("#e8dba8", 1);
    sun.position.set(0, 20, 10);
    sun.castShadow = true;
    sun.shadow.bias = -0.0005;
    sun.shadow.mapSize.width = 1024 * 3;
    sun.shadow.radius = 3;
    sun.shadow.mapSize.height = 1024 * 3;
    app.scene.add(sun);
    app.scene.add(hemisphere);
  }
}

function onWindowResize() {
  app.camera.aspect = window.innerWidth / window.innerHeight;
  app.camera.updateProjectionMatrix();
  app.renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function loadScene() {
  const manager = new THREE.LoadingManager();
  manager.onLoad = init;

  // load the scene
  const loader = new GLTFLoader(manager);
  loader.load(scene.world.url, (gltf) => {
    scene.world.gltf = gltf;
    app.scene.add(gltf.scene);
  });
}

// initialize shadows, animations
function init() {
  // cast and receive shadows
  scene.world.gltf.scene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  train.mesh = scene.world.gltf.scene.children.find(
    (child) => child.name === "train"
  );
  app.mixer = new THREE.AnimationMixer(scene.world.gltf.scene);
  const clips = scene.world.gltf.animations;
  const trainClip = clips[0];
  train.action = app.mixer.clipAction(trainClip);
  train.action.timeScale = 0;
  train.action.play();

  setupKeyControls();
  render();
}

function render() {
  requestAnimationFrame(render);

  // update camera position and rotation
  update();
  app.renderer.render(app.scene, scene.camera);
}

function setupKeyControls() {
  //todo
}

function selectStop(stopName) {
  // deselect previous button
  document.getElementById(train.targetStop).classList.remove("selected");
  train.targetStop = stopName;
  document.getElementById(train.targetStop).classList.add("selected");

  // move train to new stop
  visitStop();
}

function visitStop() {
  // find which direction is faster
  let currentPos = train.action.time;
  let nextPos = track.stops[train.targetStop];
  let diff = nextPos - currentPos;

  let dir; // +ve means clockwise, -ve means anti, 0 means stationary
  if (diff > 0) {
    dir = 1;
  } else if (diff < 0) {
    dir = -1;
  } else {
    dir = 0;
  }

  // get shortest distance between current location and
  // next stop's location
  train.distLeft = Math.abs(diff);

  // other direction is shorter
  if (Math.abs(diff) > track.circumference / 2) {
    dir *= -1;
    train.distLeft = track.circumference - train.distLeft;
  }
  console.log(train.distLeft);

  train.speed = dir * train.maxSpeed;
}

function update() {
  let delta = app.clock.getDelta();

  train.distLeft -= Math.abs(delta * train.speed);

  // overshooting stop
  if (train.distLeft < 0) {
    train.action.time = track.stops[train.targetStop];
    train.speed = 0;
  }

  train.action.timeScale = train.speed;
  if (app.mixer) app.mixer.update(delta);

  scene.camera.position.set(
    train.mesh.position.x,
    train.mesh.position.y + 0.5,
    train.mesh.position.z
  );
}

createApp();
setupScene();
loadScene();

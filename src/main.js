import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const manager = new THREE.LoadingManager();

const gltfLoader = new GLTFLoader(manager);
let nibbles = "src/res/model/bunny.gltf";
let nibblesModel;
gltfLoader.load(
  nibbles,
  (gltf) => {
    nibblesModel = gltf.scene.children.find(
      (child) => child.name === "nibbles"
    );
    nibblesModel.scale.set(
      nibblesModel.scale.x * 0.5,
      nibblesModel.scale.y * 0.5,
      nibblesModel.scale.z * 0.5
    );

    nibblesModel.position.y -= 1;
    scene.add(nibblesModel);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color("gray");

const ambient = new THREE.AmbientLight("#262626");
const light = new THREE.PointLight("white", 1.5, 100);
light.position.set(-1, 2, 3);
scene.add(light);
scene.add(ambient);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function render() {
  requestAnimationFrame(render);
  nibblesModel.rotation.z += 0.02;
  renderer.render(scene, camera);
}
render();

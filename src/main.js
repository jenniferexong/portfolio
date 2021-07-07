import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Scene {
  scene;
  camera;
  renderer;
  controls;
  mixer;
  train;
  clock;

  // setup
  constructor() {
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;
    this.camera.position.y = 2;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);

    // set background
    this.scene.background = new THREE.Color("skyblue");

    // sun (natural light)
    const ambient = new THREE.AmbientLight("gray");
    const light = new THREE.PointLight("white", 1.5, 100);
    light.position.set(-2, 50, 20);
    this.scene.add(light);
    this.scene.add(ambient);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    this.loadModels();
  }

  loadModels() {
    const models = {
      world: { url: "src/res/model/world.gltf" },
    };

    {
      const manager = new THREE.LoadingManager();
      const loader = new GLTFLoader(this.manager);
      for (const model of Object.values(models)) {
        loader.load(model.url, (gltf) => {
          model.gltf = gltf;
          this.scene.add(gltf.scene);
          this.train = gltf.scene.children.find(
            (child) => child.name === "train"
          );
          this.mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            this.mixer.clipAction(clip).play();
          });
        });
      }
    }
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.update();
    this.renderer.render(this.scene, this.camera);
  };

  // update camera position and rotation
  update = () => {
    var delta = this.clock.getDelta();
    if (this.mixer) this.mixer.update(delta);
  };
}

const scene = new Scene();
scene.render();

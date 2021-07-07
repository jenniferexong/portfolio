import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Scene {
  // setup
  constructor() {
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
          // model = gltf.scene.children.find((child) => child.name === "nibbles")
          // model.scale.set(model.scale.x * 1, ...., ...);
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
  update = () => {};
}

const scene = new Scene();
scene.render();

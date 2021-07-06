import * as t from "three";

export class Scene {
  scene;
  camera;
  renderer;
  cube;

  constructor(width, height) {
    console.log(width);
    console.log(height);
    this.scene = new t.Scene();
    this.camera = new t.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new t.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;

    this.scene.background = new t.Color("#121d23");

    const ambient = new t.AmbientLight("#262626");
    const light = new t.PointLight("white", 1.5, 100);
    light.position.set(-1, 2, 3);
    this.scene.add(light);
    this.scene.add(ambient);

    var geometry = new t.BoxGeometry(2, 2, 2);
    var material = new t.MeshStandardMaterial({ color: "#538792" });
    this.cube = new t.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.camera.position.z = 5;
  }

  get element() {
    return this.renderer.domElement;
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  };
}

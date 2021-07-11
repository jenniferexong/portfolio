import * as THREE from "three";
import CreateTrain from "./Train.js";
import loadGltf from "./Loader.js";

const CreateScene = async (gltfUrl) => {
  const scene_ = new THREE.Scene();

  // background and fog
  {
    const skyColor = "#77cacf";
    const near = 15;
    const far = 50;
    scene_.fog = new THREE.Fog(skyColor, near, far);
    scene_.background = new THREE.Color(skyColor);
  }

  // lighting
  {
    const hemisphere = new THREE.HemisphereLight("white", "black", 0.4);
    const ambient = new THREE.AmbientLight("white", 0.1);
    scene_.add(ambient);
    const sun = new THREE.PointLight("#e8dba8", 1);
    sun.position.set(0, 20, 10);
    sun.castShadow = true;
    sun.shadow.bias = -0.0005;
    sun.shadow.mapSize.width = 1024 * 3;
    sun.shadow.radius = 3;
    sun.shadow.mapSize.height = 1024 * 3;
    scene_.add(sun);
    scene_.add(hemisphere);
  }

  // loads a scene from a gltf/glb file, setting shadows
  // const manager = new THREE.LoadingManager();
  // manager.onLoad = finishLoading;
  const gltf_ = await loadGltf(gltfUrl);
  scene_.add(gltf_.scene);

  initShadows();
  const train_ = CreateTrain(gltf_, "train", "trainAction");

  function initShadows() {
    // set every mesh in gltf to cast and receive shadows
    gltf_.scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }

  return {
    add: (elem) => {
      scene_.add(elem);
    },

    selectStop: (stopName) => {
      train_.setTargetStop(stopName);
    },

    getScene: () => {
      return scene_;
    },

    update: (delta) => {
      train_.update(delta);
    },

    getTrainPos: () => {
      return train_.position();
    },
  };
};

export default CreateScene;
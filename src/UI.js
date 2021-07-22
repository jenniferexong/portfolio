import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

// handles all ui functionality
export const initUI = ({ renderer, camera, render, scene }) => {
  // attach renderer to window
  document.body.appendChild(renderer.domElement);

  // window resize
  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  }

  // mouse control camera
  const controls = new PointerLockControls(camera, renderer.domElement);

  controls.domElement.addEventListener("click", () => {
    controls.lock();
  });

  const instructions = document.getElementById("instructions");
  //const exitInstructions = document.getElementById("exit");

  controls.addEventListener("lock", () => {
    instructions.innerHTML = "Press escape to select a stop";
  });

  controls.addEventListener("unlock", () => {
    instructions.innerHTML = "Select a stop";
  });

  // select stop buttons
  const buttons = document.getElementsByClassName("stopButtons");
  for (const button of buttons) {
    button.addEventListener("click", (e) => {
      scene.selectStop(e.target.id);
      controls.lock();
    });
  }
};

export const onProgress = (progressEvent) => {
  let percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
  document.getElementById("loadingProgress").style.width = `${percent}%`;
};

export const onLoad = () => {
  document.getElementById("loadingScreen").style.display = "none";
};

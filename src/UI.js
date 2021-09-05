import { Direction } from "./track.js";
// handles all ui functionality
export const initUI = ({
  renderer,
  camera,
  render,
  scene,
  controls,
  mousePicker,
}) => {
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

  // Click event
  document.addEventListener("click", (e) => {
    if (controls.isLocked) {
      mousePicker.onClick();
    } else {
      controls.lock();
    }
  });

  const outOfFocusOverlay = document.getElementById("outOfFocus");

  // Key event
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
    }

    if (e.key === "Escape") {
      controls.unlock();
      return;
    }

    if (!controls.isLocked) {
      controls.lock();
      return;
    }

    switch (e.key) {
      case "a":
      case "ArrowLeft":
        scene.trainDriver.ponderPreviousStop();
        break;
      case "d":
      case "ArrowRight":
        scene.trainDriver.ponderNextStop();
        break;
      case " ":
      case "Enter":
        scene.trainDriver.lockInStop();
        break;
    }

    if (!e.repeat) {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          scene.trainDriver.driveInDirection(Direction.FORWARD);
          break;
        case "s":
        case "ArrowDown":
          scene.trainDriver.driveInDirection(Direction.BACKWARD);
          break;
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
    }

    if (!controls.isLocked) return;

    switch (e.key) {
      case "w":
      case "s":
      case "ArrowUp":
      case "ArrowDown":
        scene.trainDriver.releasePedal();
    }
  });

  const crosshair = document.getElementById("crossHair");
  const gui = document.getElementById("gui");

  controls.addEventListener("lock", () => {
    crosshair.style.display = "flex";
    outOfFocusOverlay.style.display = "none";
    gui.style.display = "flex";
  });

  controls.addEventListener("unlock", () => {
    crosshair.style.display = "none";
    outOfFocusOverlay.style.display = "flex";
    gui.style.display = "none";
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

import swal from "sweetalert";
import { Direction } from "./track";
import { playVideo, stopVideo, renderScene, updateButtons } from "./view";
import { PerspectiveCamera, Renderer } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { MousePicker } from "./mousepicker";
import { Scene } from "./scene";

export let myAlert: (message: string) => void;

// handles all ui functionality
export const initUI = ({
  renderer,
  camera,
  scene,
  controls,
  mousePicker,
}: {
  renderer: Renderer;
  camera: PerspectiveCamera;
  scene: Scene;
  controls: PointerLockControls;
  mousePicker: MousePicker;
}) => {
  document.body.appendChild(renderer.domElement);

  controls.addEventListener("change", () => {
    mousePicker.onHover();
    renderScene();
  });

  const video = document.getElementById("demo");
  if (!video) throw new Error("#demo video not found");

  video.addEventListener("play", (e) => {
    playVideo();
  });

  video.addEventListener("pause", (e) => {
    stopVideo();
    renderScene();
  });

  // window resize
  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderScene();
  }

  // Click event
  document.addEventListener("click", (e) => {
    if (controls.isLocked) {
      mousePicker.onClick();
    } else {
      controls.lock();
      showHud();
    }
  });

  const outOfFocusOverlay = document.getElementById("outOfFocus");
  if (!outOfFocusOverlay) throw new Error("#outOfFocus overlay not found");

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
        updateButtons();
        break;
      case "d":
      case "ArrowRight":
        scene.trainDriver.ponderNextStop();
        updateButtons();
        break;
      case " ":
      case "Enter":
        scene.trainDriver.lockInStop();
        updateButtons();
        break;
    }

    if (!e.repeat) {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          scene.trainDriver.driveInDirection(Direction.Forward);
          break;
        case "s":
        case "ArrowDown":
          scene.trainDriver.driveInDirection(Direction.Backward);
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
  if (!crosshair) throw new Error("crosshair not found");

  const gui = document.getElementById("gui");
  if (!gui) throw new Error("gui not found");

  const showHud = () => {
    crosshair.style.display = "flex";
    outOfFocusOverlay.style.display = "none";
    gui.style.display = "flex";
  };

  const hideHud = () => {
    crosshair.style.display = "none";
    outOfFocusOverlay.style.display = "flex";
    gui.style.display = "none";
  };

  controls.addEventListener("unlock", () => {
    hideHud();
  });

  controls.addEventListener("lock", () => {
    showHud();
  });

  myAlert = (message) => {
    swal(message, { className: "alert" });
    controls.unlock();
  };
};

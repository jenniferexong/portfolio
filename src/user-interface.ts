import swal from "sweetalert";

import { Direction } from "./track";
import { App } from "./app";
import { pauseVideo, playVideo, renderScene, updateButtons } from "./view";

/**
 * Opens an alert overlay with a given message
 */
export let alert: (message: string) => void;

export const initializeUserInterface = ({
  renderer,
  camera,
  scene,
  controls,
  mousePicker,
}: App) => {
  document.body.appendChild(renderer.domElement);

  controls.addEventListener("change", () => {
    mousePicker.onHover();
    renderScene();
  });

  const video = document.getElementById("demo");
  if (!video) throw new Error("#demo video not found");

  video.addEventListener("play", () => {
    playVideo();
  });

  video.addEventListener("pause", () => {
    pauseVideo();
    renderScene();
  });

  // Click event
  document.addEventListener("click", (e) => {
    if (controls.isLocked) {
      mousePicker.onClick();
    } else {
      controls.lock();
      showHud();
    }
  });

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderScene();
  };

  window.addEventListener("resize", onWindowResize, false);

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

    // Controls for automatic travel to a stop
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

    // Controls for manual travel to a stop
    if (!e.repeat) {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          scene.trainDriver.driveManual(Direction.Forward);
          break;
        case "s":
        case "ArrowDown":
          scene.trainDriver.driveManual(Direction.Backward);
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

  controls.addEventListener("unlock", hideHud);

  controls.addEventListener("lock", showHud);

  alert = (message) => {
    swal(message, { className: "alert" });
    controls.unlock();
  };
};

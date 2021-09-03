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

  // Key event
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
    }
    if (controls.isLocked) {
      // unlocking
      if (e.key === "Escape") {
        controls.unlock();
      } else if (e.key === "w") {
      } else if (e.key === "s") {
      } else if (e.key === "a" || e.key === "ArrowLeft") {
        scene.trainDriver.ponderPreviousStop();
      } else if (e.key === "d" || e.key === "ArrowRight") {
        scene.trainDriver.ponderNextStop();
      } else if (e.key === "Enter" || e.key === " ") {
        scene.trainDriver.lockInStop();
      }
    }
  });

  //   const instructions = document.getElementById("instructions");
  const crosshair = document.getElementById("crossHair");

  controls.addEventListener("lock", () => {
    // instructions.innerHTML = "Press escape to select a stop";
    crosshair.style.display = "flex";
  });

  controls.addEventListener("unlock", () => {
    // instructions.innerHTML = "Select a stop";
    crosshair.style.display = "none";
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

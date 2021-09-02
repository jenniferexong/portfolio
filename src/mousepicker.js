import * as THREE from "three";

// ray casting / mouse picking
export const createMousePicker = (camera, scene) => {
  // location of the mouse in screen coordinates
  const coords = new THREE.Vector2(0, 0);
  const rayCaster = new THREE.Raycaster();

  // Gets all object that the mouse ray is intersecting
  function getIntersecting() {
    rayCaster.setFromCamera(coords, camera);
    return rayCaster.intersectObjects(scene.getPickable(), false);
  }

  function onHover() {
    const intersects = getIntersecting();
    for (let i = 0; i < intersects.length; i++) {}
  }

  function onClick() {
    console.log("Mouse picker on click");

    const intersects = getIntersecting();
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object.name === "i_play_button") {
        console.log("toggle play");
        let video = document.getElementById("video");
        video.paused ? video.play() : video.pause();
      }
    }
  }

  return {
    onHover,
    onClick,
  };
};

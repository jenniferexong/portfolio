import * as THREE from "three";

// ray casting / mouse picking
const CreateMousePicker = (camera, scene) => {
  // location of the mouse in screen coordinates
  const coords_ = new THREE.Vector2(0, 0);
  const ray_caster_ = new THREE.Raycaster();

  // Gets all object that the mouse ray is intersecting
  function getIntersecting() {
    ray_caster_.setFromCamera(coords_, camera);
    return ray_caster_.intersectObjects(scene.getPickable(), false);
  }

  function hover() {
    const intersects = getIntersecting();
    for (let i = 0; i < intersects.length; i++) {}
  }

  function click() {
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
    onHover: hover,
    onClick: click,
  };
};

export default CreateMousePicker;

import * as THREE from "three";

// ray casting / mouse picking
const CreateMousePicker = (camera, scene) => {
  // location of the mouse in screen coordinates
  const coords_ = new THREE.Vector2(0, 0);
  const ray_caster_ = new THREE.Raycaster();

  // Gets all object that the mouse ray is intersecting
  function getIntersecting() {
    ray_caster_.setFromCamera(coords_, camera);
    return ray_caster_.intersectObjects(scene.getPickable(), true);
  }

  function hover() {
    const intersects = getIntersecting();
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material.color.set(0xff0000);
    }
  }

  function click() {
    console.log("Mouse picker on click");
  }

  return {
    onHover: hover,
    onClick: click,
  };
};

export default CreateMousePicker;

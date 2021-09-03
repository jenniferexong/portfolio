import * as THREE from "three";

// ray casting / mouse picking
export const createMousePicker = (camera, scene) => {
  // location of the mouse in screen coordinates
  const coords = new THREE.Vector2(0, 0);
  const rayCaster = new THREE.Raycaster();

  // Gets the names of objects that the mouse ray is intersecting
  function getIntersecting() {
    rayCaster.setFromCamera(coords, camera);
    const intersecting = rayCaster.intersectObjects(
      Object.values(scene.interactiveObjects),
      false
    );

    return intersecting.map((i) => i.object.name);
  }

  function onHover() {
    const intersects = getIntersecting();
    for (const [key, value] of Object.entries(scene.interactable)) {
      // hovering
      if (intersects.includes(key)) {
        value.onHover();
      } else {
        value.offHover();
      }
    }
  }

  function onClick() {
    console.log("Mouse picker on click");

    const intersects = getIntersecting();
    for (const name of intersects) {
      if (name in scene.interactable) {
        scene.interactable[name].onClick();
      }
    }
  }

  return {
    onHover,
    onClick,
  };
};

import { Scene } from "scene";
import * as THREE from "three";
import { Camera, Object3D } from "three";

export interface MousePicker {
  onHover: () => void;
  onClick: () => void;
}

// ray casting / mouse picking
export const createMousePicker = (
  camera: Camera,
  scene: Scene
): MousePicker => {
  // location of the mouse in screen coordinates
  const coords = new THREE.Vector2(0, 0);
  const rayCaster = new THREE.Raycaster();

  // Gets the names of objects that the mouse ray is intersecting
  function getIntersecting() {
    rayCaster.setFromCamera(coords, camera);
    const intersecting = rayCaster.intersectObjects(
      Array.from(scene.interactableData.values()),
      false
    );

    return intersecting.map((i) => i.object.name);
  }

  function onHover() {
    const intersects = getIntersecting();
    for (const [key, value] of Object.entries(scene.interactables)) {
      // hovering
      if (intersects.includes(key)) {
        value?.onHover?.();
      } else {
        value.offHover?.();
      }
    }
  }

  function onClick() {
    const intersects = getIntersecting();
    for (const name of intersects) {
      if (name in scene.interactables) {
        scene.interactables[name].onClick?.();
      }
    }
  }

  return {
    onHover,
    onClick,
  };
};

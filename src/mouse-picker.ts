import * as Three from "three";

import { Scene } from "./scene";

export interface MousePicker {
  onHover: VoidFunction;
  onClick: VoidFunction;
}

// Ray casting / mouse picking
export const createMousePicker = (
  camera: Three.PerspectiveCamera,
  scene: Scene
): MousePicker => {
  // location of the mouse in screen coordinates
  const coords = new Three.Vector2(0, 0);
  const rayCaster = new Three.Raycaster();

  // Gets the names of objects that the mouse ray is intersecting
  const getIntersecting = () => {
    rayCaster.setFromCamera(coords, camera);
    const intersecting = rayCaster.intersectObjects(
      Array.from(scene.interactableData.values()),
      false
    );

    return intersecting.map((i) => i.object.name);
  };

  const onHover = () => {
    const intersects = getIntersecting();
    for (const [key, value] of Object.entries(scene.interactables)) {
      // hovering
      if (intersects.includes(key)) {
        value?.onHover?.();
      } else {
        value.offHover?.();
      }
    }
  };

  const onClick = () => {
    const intersects = getIntersecting();
    for (const name of intersects) {
      if (name in scene.interactables) {
        scene.interactables[name].onClick?.();
      }
    }
  };

  return {
    onHover,
    onClick,
  };
};

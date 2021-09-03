/**
 * Handles the display of HTML elements, such as buttons
 * and overlays
 */
export const createView = (scene) => {
  const stopInfo = scene.trainDriver.stopManager;

  const update = () => {
    updateStopButtons();
  };

  const updateStopButtons = () => {
    const {
      currentStop,
      previousStop,
      hoveredStop,
      previousHoveredStop,
      targetStop,
    } = stopInfo;

    currentStop;

    // unselect previousStop
    document.getElementById(previousStop).classList.remove("selected");

    // select currentStop
    document.getElementById(currentStop).classList.add("selected");

    // unhover previous hovered
    document.getElementById(previousHoveredStop).classList.remove("hovered");

    // hover current hovered, if not the current stop
    if (hoveredStop === currentStop) {
      document.getElementById(hoveredStop).classList.remove("hovered");
    } else {
      document.getElementById(hoveredStop).classList.add("hovered");
    }
  };

  return {
    update,
  };
};

/**
 * Handles the display of HTML elements, such as buttons
 * and overlays
 */
export const createView = (scene) => {
  const stopInfo = scene.trainDriver.stopInfo;
  const track = scene.trainDriver.track;

  const update = () => {
    updateStopButtons();
  };

  // Stop buttons
  let buttons = {};

  track
    .getStopNames()
    .forEach((name) => (buttons[name] = document.getElementById(name)));

  const updateStopButtons = () => {
    const { currentStop, hoveredStop, targetStop } = stopInfo;

    for (let [name, button] of Object.entries(buttons)) {
      button.setAttribute("class", "stopButtons");

      if (name === currentStop) {
        button.classList.add("current");
      } else if (name === targetStop) {
        button.classList.add("target");
      } else if (name === hoveredStop) {
        button.classList.add("hovered");
      }
    }
  };

  return {
    update,
  };
};

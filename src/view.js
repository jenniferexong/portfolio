export let updateButtons;
export let renderScene;
export let playVideo;
export let stopVideo;

/**
 * Handles the display of HTML elements, such as buttons
 * and overlays
 */
export const createView = (camera, scene, renderer) => {
  const stopInfo = scene.trainDriver.stopInfo;
  const track = scene.trainDriver.track;

  let playingVideo = false;

  /**
   * Called when an animation is updated, or the camera moves.
   * Shouldn't be called when the video is playing.
   */
  renderScene = () => {
    if (playingVideo) return;

    console.log("render");
    renderer.render(scene.getScene(), camera);
  };

  let requestId;

  playVideo = () => {
    playingVideo = true;
    requestId = requestAnimationFrame(playVideo);
    console.log("video");
    renderer.render(scene.getScene(), camera);
  };

  stopVideo = () => {
    playingVideo = false;
    cancelAnimationFrame(requestId);
  };

  // Stop buttons
  let buttons = {};

  track
    .getStopNames()
    .forEach((name) => (buttons[name] = document.getElementById(name)));

  updateButtons = () => {
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
};

import { Scene } from "scene";
import { PerspectiveCamera, Renderer } from "three";

export let updateButtons: () => void;
export let renderScene: () => void;
export let playVideo: () => void;
export let stopVideo: () => void;

/**
 * Handles the display of HTML elements, such as buttons
 * and overlays
 */
export const createView = (
  camera: PerspectiveCamera,
  scene: Scene,
  renderer: Renderer
) => {
  const stopInfo = scene.trainDriver.stopInfo;
  const track = scene.trainDriver.track;

  let playingVideo = false;

  /**
   * Called when an animation is updated, or the camera moves.
   * Shouldn't be called when the video is playing.
   */
  renderScene = () => {
    if (playingVideo) return;

    renderer.render(scene.getScene(), camera);
  };

  let requestId: number;

  playVideo = () => {
    playingVideo = true;
    requestId = requestAnimationFrame(playVideo);
    renderer.render(scene.getScene(), camera);
  };

  stopVideo = () => {
    playingVideo = false;
    cancelAnimationFrame(requestId);
  };

  // Stop buttons
  const buttons = new Map(
    track.getStopNames().map((name) => [name, document.getElementById(name)])
  );

  updateButtons = () => {
    const { currentStop, hoveredStop, targetStop } = stopInfo;

    for (const [name, button] of buttons) {
      button?.setAttribute("class", "stopButtons");

      if (name === currentStop) {
        button?.classList.add("current");
      } else if (name === targetStop) {
        button?.classList.add("target");
      } else if (name === hoveredStop) {
        button?.classList.add("hovered");
      }
    }
  };
};

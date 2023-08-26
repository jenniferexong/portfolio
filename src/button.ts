import * as Three from "three";

import { Interactable } from "./interactable";

// The scale of button icons when hovered over
const HOVER_SCALE = 1.25;

/**
 * An interactable button which has text/icon that increases in size on hover.
 */
class Button implements Interactable {
  initialScale: Three.Vector3;
  initialPos: Three.Vector3;

  constructor(protected popoutMesh: Three.Mesh) {
    this.initialScale = popoutMesh.scale.clone();
    this.initialPos = popoutMesh.position.clone();
  }

  /**
   * Increases the size of the button's icon
   */
  onHover() {
    this.popoutMesh.position.set(0, 0, 0);

    this.popoutMesh.scale.set(
      this.initialScale.x * HOVER_SCALE,
      this.initialScale.y * HOVER_SCALE,
      this.initialScale.z * HOVER_SCALE
    );

    this.popoutMesh.position.set(
      this.initialPos.x,
      this.initialPos.y,
      this.initialPos.z
    );

    this.popoutMesh.updateMatrix();
  }

  /**
   * Resets the size of the button's icon
   */
  offHover() {
    this.popoutMesh.position.set(0, 0, 0);

    this.popoutMesh.scale.set(
      this.initialScale.x,
      this.initialScale.y,
      this.initialScale.z
    );

    this.popoutMesh.position.set(
      this.initialPos.x,
      this.initialPos.y,
      this.initialPos.z
    );

    this.popoutMesh.updateMatrix();
  }
}

export class EmailButton extends Button {
  onClick() {
    navigator.clipboard.writeText("jennifer.ex.ong@gmail.com");
    alert("Copied to clipboard");
  }
}

type VideoButtonData = {
  object: Three.Mesh;
  scale: Three.Vector3;
  position: Three.Vector3;
  execute(): void;
};

export class PlayButton extends Button {
  video: HTMLVideoElement;
  pause: VideoButtonData;
  play: VideoButtonData;
  currentButton: VideoButtonData;

  /**
   * @param playIcon Icon to be displayed when the video is paused
   * @param pauseIcon Icon to be displayed when the video is playing
   * @param videoId ID of the HTML video element
   */
  constructor(playIcon: Three.Mesh, pauseIcon: Three.Mesh, videoId: string) {
    super(playIcon);

    // hide pause button
    pauseIcon.visible = false;

    const video = document.getElementById(videoId);
    if (!video || !(video instanceof HTMLVideoElement)) {
      throw new Error(`Video element with id ${videoId} not found`);
    }

    this.video = video;

    this.pause = {
      object: pauseIcon,
      scale: pauseIcon.scale.clone(),
      position: pauseIcon.position.clone(),
      execute: () => this.video.pause(),
    };

    this.play = {
      object: playIcon,
      scale: playIcon.scale.clone(),
      position: playIcon.position.clone(),
      execute: () => this.video.play(),
    };

    this.currentButton = this.play;
  }

  onClick() {
    // Perform action of current button (pause/play)
    this.currentButton.execute();

    // Switch current button
    this.currentButton = this.video.paused ? this.play : this.pause;

    // Hide previous button icon
    this.popoutMesh.visible = false;

    // Set new button information
    this.popoutMesh = this.currentButton.object;
    this.initialScale = this.currentButton.scale;
    this.initialPos = this.currentButton.position;

    // Show current button icon
    this.popoutMesh.visible = true;
  }
}

/**
 * A button that opens a link
 */
export class LinkButton extends Button {
  constructor(textMesh: Three.Mesh, private url: string) {
    super(textMesh);
    this.url = url;
  }

  onClick() {
    window.open(this.url, "_blank")?.focus();
  }
}

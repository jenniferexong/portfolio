import { Mesh, Vector3 } from "three";

import { myAlert } from "./UI";

interface Interactable {
  onClick?: () => void;
  onHover?: () => void;
  offHover?: () => void;
}

export type Interactables = { [key: string]: Interactable };

/**
 * Raw interactable object data
 */
export type InteractableData = Map<string, Mesh<any, any>>;

export const initInteractables = (
  interactive: InteractableData
): Interactables => {
  const interactables: Interactables = {};

  for (const key of interactive.keys()) {
    switch (key) {
      case "i_play_button":
        interactables[key] = new PlayButton(
          interactive.get("i_play_icon")!,
          interactive.get("i_pause_icon")!,
          "demo"
        );
        break;
      case "i_bunny_repo_button":
        interactables[key] = new LinkButton(
          interactive.get("i_bunny_repo_text")!,

          "https://github.com/jenniferexong/bunny-game"
        );
        break;
      case "i_split_repo_button":
        interactables[key] = new LinkButton(
          interactive.get("i_split_repo_text")!,
          "https://github.com/jenniferexong/split"
        );
        break;
      case "i_ribble_repo_button":
        interactables[key] = new LinkButton(
          interactive.get("i_ribble_repo_text")!,
          "https://github.com/ribble-chat/ribble"
        );
        break;
      case "i_linkedin_button":
        interactables[key] = new LinkButton(
          interactive.get("i_linkedin_text")!,
          "https://www.linkedin.com/in/jenniferexong"
        );
        break;
      case "i_github_button":
        interactables[key] = new LinkButton(
          interactive.get("i_github_text")!,
          "https://github.com/jenniferexong"
        );
        break;
      case "i_email_button":
        interactables[key] = new EmailButton(interactive.get("i_email_text")!);
        break;
    }
  }
  return interactables;
};

// The scale of button icons when hovered over
const HOVER_SCALE = 1.25;

/**
 * Button's text/icon increases in size on hover
 */
class Button implements Interactable {
  initialScale: Vector3;
  initialPos: Vector3;

  constructor(protected popoutMesh: Mesh) {
    this.initialScale = popoutMesh.scale.clone();
    this.initialPos = popoutMesh.position.clone();
  }

  /**
   * Increases the size of this button's icon
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
   * Resets the size of this button's icon
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

class EmailButton extends Button {
  onClick() {
    navigator.clipboard.writeText("jennifer.ex.ong@gmail.com");
    myAlert("Copied to clipboard");
  }
}

type VideoButtonData = {
  object: Mesh;
  scale: Vector3;
  position: Vector3;
  do(): void;
};

class PlayButton extends Button {
  video: HTMLVideoElement;
  pause: VideoButtonData;
  play: VideoButtonData;
  currentButton: VideoButtonData;

  /**
   * @param {Mesh} playIcon Icon to be displayed when the video is paused
   * @param {Mesh} pauseIcon Icon to be displayed when the video is playing
   * @param {String} videoId ID of the HTML video element
   */
  constructor(
    playIcon: Mesh,
    private pauseIcon: Mesh,
    private videoId: string
  ) {
    super(playIcon);

    // hide pause button
    pauseIcon.visible = false;
    this.popoutMesh = playIcon;

    const video = document.getElementById(videoId);
    if (!video || !(video instanceof HTMLVideoElement))
      throw new Error(`Video element with id ${videoId} not found`);

    this.video = video;

    this.pause = {
      object: pauseIcon,
      scale: pauseIcon.scale.clone(),
      position: pauseIcon.position.clone(),
      do: () => this.video.pause(),
    };

    this.play = {
      object: playIcon,
      scale: playIcon.scale.clone(),
      position: playIcon.position.clone(),
      do: () => this.video.play(),
    };

    this.currentButton = this.play;
  }

  onClick() {
    // Perform action of current button (pause/play)
    this.currentButton.do();

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
class LinkButton extends Button {
  constructor(textMesh: Mesh, private url: string) {
    super(textMesh);
    this.url = url;
  }

  onClick() {
    window.open(this.url, "_blank")?.focus();
  }
}

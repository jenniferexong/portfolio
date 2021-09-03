import * as THREE from "three";
class Interactable {
  onClick() {}
  onHover() {}
  offHover() {}
}
export const initInteractables = (interactive) => {
  const interactable = {};

  for (const [key, value] of Object.entries(interactive)) {
    switch (key) {
      case "i_play_button":
        interactable[key] = new PlayButton(
          interactive["i_play_icon"],
          interactive["i_pause_icon"],
          "demo"
        );
        break;
      case "i_bunny_repo_button":
        interactable[key] = new LinkButton(
          interactive["i_bunny_repo_text"],
          "https://github.com/jenniferexong/bunny-game"
        );
        break;
      case "i_ribble_repo_button":
        interactable[key] = new LinkButton(
          interactive["i_ribble_repo_text"],
          "https://github.com/ribble-chat/ribble"
        );
        break;
      case "i_linkedin_button":
        interactable[key] = new LinkButton(
          interactive["i_linkedin_text"],
          "https://www.linkedin.com/in/jennifer-ong-899a6a14a/"
        );
        break;
      case "i_github_button":
        interactable[key] = new LinkButton(
          interactive["i_github_text"],
          "https://github.com/jenniferexong"
        );
        break;
      case "i_email_button":
        interactable[key] = new Button(interactive["i_email_text"]);
        break;
    }
  }
  return interactable;
};

// The scale of button icons when hovered over
const HOVER_SCALE = 1.25;

/**
 * Button's text/icon increases in size on hover
 */
class Button extends Interactable {
  constructor(textOrIcon) {
    super();
    this.icon = textOrIcon;

    this.initialScale = textOrIcon.scale.clone();
    this.initialPos = textOrIcon.position.clone();
  }

  /**
   * Increases the size of this button's icon
   */
  onHover() {
    this.icon.position.set(0, 0, 0);

    this.icon.scale.set(
      this.initialScale.x * HOVER_SCALE,
      this.initialScale.y * HOVER_SCALE,
      this.initialScale.z * HOVER_SCALE
    );

    this.icon.position.set(
      this.initialPos.x,
      this.initialPos.y,
      this.initialPos.z
    );

    this.icon.updateMatrix();
  }

  /**
   * Resets the size of this button's icon
   */
  offHover() {
    this.icon.position.set(0, 0, 0);

    this.icon.scale.set(
      this.initialScale.x,
      this.initialScale.y,
      this.initialScale.z
    );

    this.icon.position.set(
      this.initialPos.x,
      this.initialPos.y,
      this.initialPos.z
    );

    this.icon.updateMatrix();
  }
}

class PlayButton extends Button {
  /**
   * @param {Object3D} playIcon Icon to be displayed when the video is paused
   * @param {Object3D} pauseIcon Icon to be displayed when the video is playing
   * @param {String} videoId ID of the HTML video element
   */
  constructor(playIcon, pauseIcon, videoId) {
    super(playIcon);

    // hide pause button
    pauseIcon.visible = false;
    this.icon = playIcon;

    this.video = document.getElementById(videoId);

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
    this.icon.visible = false;

    // Set new button information
    this.icon = this.currentButton.object;
    this.initialScale = this.currentButton.scale;
    this.initialPos = this.currentButton.position;

    // Show current button icon
    this.icon.visible = true;
  }
}

/**
 * A button that opens a link
 */
class LinkButton extends Button {
  constructor(textObj, url) {
    super(textObj);
    this.url = url;
  }

  onClick() {
    window.open(this.url, "_blank").focus();
  }
}

import * as THREE from "three";

class Interactable {
  onClick() {}
  onHover() {}
  offHover() {}
}

const S = 1.25;
/**
 * Button's text/icon increases in size on hover
 */
class Button extends Interactable {
  constructor(textOrIcon) {
    super();
    this.icon = textOrIcon;

    this.hoverScale = new THREE.Vector3(
      this.icon.scale.x * S,
      this.icon.scale.y * S,
      this.icon.scale.z * S
    );

    this.initialScale = new THREE.Vector3(
      this.icon.scale.x,
      this.icon.scale.y,
      this.icon.scale.z
    );

    this.initialPos = new THREE.Vector3(
      this.icon.position.x,
      this.icon.position.y,
      this.icon.position.z
    );
  }

  onHover() {
    this.icon.position.set(0, 0, 0);

    this.icon.scale.set(
      this.hoverScale.x,
      this.hoverScale.y,
      this.hoverScale.z
    );

    this.icon.position.set(
      this.initialPos.x,
      this.initialPos.y,
      this.initialPos.z
    );

    this.icon.updateMatrix();
  }

  onClick() {}

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

export const initInteractables = (interactive) => {
  const interactable = {};

  for (const [key, value] of Object.entries(interactive)) {
    switch (key) {
      case "i_play_button":
        interactable[key] = new Button(interactive["i_play_icon"]);
        break;
      case "i_bunny_repo_button":
        interactable[key] = new Button(interactive["i_bunny_repo_text"]);
        break;
      case "i_ribble_repo_button":
        interactable[key] = new Button(interactive["i_ribble_repo_text"]);
        break;
      case "i_linkedin_button":
        interactable[key] = new Button(interactive["i_linkedin_text"]);
        break;
      case "i_email_button":
        interactable[key] = new Button(interactive["i_email_text"]);
        break;
      case "i_github_button":
        interactable[key] = new Button(interactive["i_github_text"]);
        break;
    }
  }
  return interactable;
};

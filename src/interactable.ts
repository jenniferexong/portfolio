import * as Three from "three";

import { EmailButton, LinkButton, PlayButton } from "./button";

export interface Interactable {
  onClick?: VoidFunction;
  onHover?: VoidFunction;
  offHover?: VoidFunction;
}

/**
 * Where name matches the name of the mesh.
 */
export type Interactables = { [name: string]: Interactable };

/**
 * Key-value pairs of mesh name and mesh.
 */
export type InteractableData = Map<string, Three.Mesh<any, any>>;

export const createInteractables = (
  interactive: InteractableData
): Interactables => {
  const interactables: Interactables = {};

  for (const name of interactive.keys()) {
    switch (name) {
      case "i_play_button":
        interactables[name] = new PlayButton(
          interactive.get("i_play_icon")!,
          interactive.get("i_pause_icon")!,
          "demo"
        );
        break;
      case "i_bunny_repo_button":
        interactables[name] = new LinkButton(
          interactive.get("i_bunny_repo_text")!,
          "https://github.com/jenniferexong/bunny-game"
        );
        break;
      case "i_split_repo_button":
        interactables[name] = new LinkButton(
          interactive.get("i_split_repo_text")!,
          "https://github.com/jenniferexong/split"
        );
        break;
      case "i_ribble_repo_button":
        interactables[name] = new LinkButton(
          interactive.get("i_ribble_repo_text")!,
          "https://github.com/ribble-chat/ribble"
        );
        break;
      case "i_linkedin_button":
        interactables[name] = new LinkButton(
          interactive.get("i_linkedin_text")!,
          "https://www.linkedin.com/in/jenniferexong"
        );
        break;
      case "i_github_button":
        interactables[name] = new LinkButton(
          interactive.get("i_github_text")!,
          "https://github.com/jenniferexong"
        );
        break;
      case "i_email_button":
        interactables[name] = new EmailButton(interactive.get("i_email_text")!);
        break;
    }
  }
  return interactables;
};

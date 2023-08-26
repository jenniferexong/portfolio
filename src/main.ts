import { renderScene } from "./view";
import { App, createApp } from "./app";
import { initializeUserInterface } from "./user-interface";

createApp().then((app: App) => {
  initializeUserInterface(app);
  app.update();
  renderScene();
});

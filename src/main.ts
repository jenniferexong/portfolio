import { App, createApp } from "./app";
import { renderScene } from "./view";
import { initUI } from "./UI";

createApp().then((app: App) => {
  initUI(app);
  app.update();
  renderScene();
});

import { createApp } from "./app";
import { initUI } from "./UI";
import { renderScene } from "./view";

createApp().then((app) => {
  initUI(app);
  app.update();
  renderScene();
});

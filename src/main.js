import { createApp } from "./app.js";
import { initUI } from "./UI.js";
import { renderScene } from "./view.js";

createApp().then((app) => {
  initUI(app);
  app.update();
  renderScene();
});

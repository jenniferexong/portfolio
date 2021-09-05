import { createApp } from "./app.js";
import { initUI } from "./UI.js";

createApp().then((app) => {
  initUI(app);
  app.render();
});

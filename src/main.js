import CreateApp from "./app.js";
import { initUI } from "./UI.js";

CreateApp().then((app) => {
  initUI(app);
  app.render();
});

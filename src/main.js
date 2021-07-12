import CreateApp from "./App.js";
import { initUI } from "./UI.js";

CreateApp().then((app) => {
  initUI(app);
  app.render();
});

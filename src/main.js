import { createApp } from "./app.js";
import { initUI } from "./UI.js";

const app = await createApp();
initUI(app);
app.render();

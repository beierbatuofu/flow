import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import simplestFlow from "simplest-flow";

import "@node_modules/simplest-flow/dist/simplest-flow.css";

const app = createApp(App);
app.use(ElementPlus);
app.use(simplestFlow);
app.mount("#app");

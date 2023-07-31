import { App } from "vue";
import TextClamp from "./TextClamp.vue";
export { TextClamp };
export default {
  install(app: App) {
    app.component(TextClamp.name, TextClamp);
  },
};

import { App } from "vue";
import TextClamp from "./TextClamp.vue";

// 导出组件
export { TextClamp };

// 默认导出（用于Vue.use()）
export default {
  install(app: App) {
    app.component("TextClamp", TextClamp);
  },
};
